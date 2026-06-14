import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { TestsService } from '../tests/tests.service';
import { TAKE_TEST_PROMPT_RU, CREATE_TEST_PROMPT_RU } from './prompts';

@Injectable()
export class BotService {
  private readonly logger = new Logger(BotService.name);

  // in-memory session for bot
  private authorized = false;
  private botUser: any = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  // prevent concurrent bot tasks
  private activeTask = false;

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private configService: ConfigService,
    private testsService: TestsService,
  ) {}

  async validateServiceKey(keyHash: string): Promise<boolean> {
    const serviceKey = await this.prisma.serviceKey.findFirst({
      where: {
        keyHash,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return !!serviceKey;
  }

  isAuthorized() {
    return this.authorized && !!this.botUser;
  }

  getBotInfo() {
    return {
      authorized: this.isAuthorized(),
      username: this.botUser?.username ?? null,
      id: this.botUser?.id ?? null,
    };
  }

  async authorizeBot(): Promise<{ success: boolean; message: string }> {
    const username = this.configService.get<string>('AI_BOT_USERNAME');
    const password = this.configService.get<string>('AI_BOT_PASSWORD');

    if (!username || !password) {
      return { success: false, message: 'AI_BOT_USERNAME or AI_BOT_PASSWORD not configured' };
    }

    // validate credentials
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return { success: false, message: 'Bot credentials are invalid or user is inactive' };
    }

    // Only allow student role for bot
    if (user.role !== 'student') {
      return { success: false, message: 'Bot must have role student' };
    }

    // create tokens
    const payload = await this.authService.login(user as any);

    this.botUser = user;
    this.accessToken = payload.accessToken;
    // @ts-ignore - login returns refreshToken for server-side
    this.refreshToken = (payload as any).refreshToken || null;
    this.authorized = true;

    this.logger.log(`AI bot authorized as ${user.username}`);

    return { success: true, message: 'Бот успешно авторизован' };
  }

  async deauthorizeBot(): Promise<{ success: boolean; message: string }> {
    if (!this.isAuthorized()) {
      return { success: false, message: 'Бот не авторизован' };
    }

    try {
      if (this.refreshToken) {
        await this.authService.revokeRefreshToken(this.refreshToken);
      }
    } catch (e) {
      this.logger.warn('Failed to revoke refresh token for bot: ' + String(e));
    }

    this.authorized = false;
    this.botUser = null;
    this.accessToken = null;
    this.refreshToken = null;

    return { success: true, message: 'Бот разавторизован' };
  }

  /**
   * Instruct bot to take a test. Returns a report and the created result (if any).
   * If AI model endpoint is configured (AI_MODEL_API_URL), it will be used, otherwise a simple heuristic is used.
   */
  async takeTest(testId: number): Promise<any> {
    if (!this.isAuthorized()) throw new Error('Bot not authorized');

    if (this.activeTask) throw new Error('Another bot task is in progress');
    this.activeTask = true;

    try {
      const test = await this.testsService.findTestById(testId);
      if (!test) throw new Error('Test not found');

      // Prepare payload
      const payload = {
        test: {
          id: test.id,
          name: (test as any).name,
          subject: test.subject?.nameSubject ?? null,
          theme: test.theme?.nameTheme ?? null,
          questions: test.questions.map((q: any) => ({
            id: q.id,
            text: q.questionText,
            answers: q.answers.map((a: any) => ({ id: a.id, text: a.answerText })),
          })),
        },
      };

      let modelResponse: any = null;
      const apiUrl = this.configService.get<string>('AI_MODEL_API_URL');
      const apiKey = this.configService.get<string>('AI_MODEL_API_KEY');

      if (apiUrl && typeof (globalThis as any).fetch === 'function') {
        try {
          const provider = this.configService.get<string>('AI_MODEL_PROVIDER') || '';

          if (provider === 'qwen') {
            // Qwen chat completion style API (generic): expect apiUrl to be the full endpoint
            const systemPrompt = TAKE_TEST_PROMPT_RU;

            const body = {
              model: this.configService.get<string>('AI_MODEL_NAME') || 'qwen-2.5',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.stringify({ action: 'takeTest', payload }) },
              ],
              temperature: 0.2,
              max_tokens: 2000,
            } as any;

            if (this.configService.get<boolean>('AI_DEBUG')) {
              this.logger.debug('AI request body: ' + JSON.stringify(body));
            }

            const res = await (globalThis as any).fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
              },
              body: JSON.stringify(body),
            });

            const json = await res.json();
            const text = json?.choices?.[0]?.message?.content || json?.data || JSON.stringify(json);
            // try to extract JSON block
            const m = String(text).match(/\{[\s\S]*\}/m);
            if (m) {
              try {
                modelResponse = JSON.parse(m[0]);
              } catch (e) {
                modelResponse = null;
              }
            } else {
              modelResponse = null;
            }
          } else if (provider === 'ollama') {
            // Ollama local API (example: http://localhost:11434/api/chat)
            // Use the contract: { model, messages, format: 'json', stream: false }
            const systemPrompt = TAKE_TEST_PROMPT_RU;
            const body = {
              model: this.configService.get<string>('AI_MODEL_NAME') || 'qwen-2.5',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.stringify({ action: 'takeTest', payload }) },
              ],
              format: 'json',
              stream: false,
            } as any;
            if (this.configService.get<boolean>('AI_DEBUG')) {
              this.logger.debug('AI request body (ollama): ' + JSON.stringify(body));
            }

            const res = await (globalThis as any).fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
              },
              body: JSON.stringify(body),
            });

            const json = await res.json();
            // Ollama returns { message: { content: '...'} } where content may be JSON string
            const text = json?.message?.content || JSON.stringify(json);
            try {
              // If content is already an object (format=json), it may be parsed
              modelResponse = typeof text === 'string' ? JSON.parse(text) : text;
            } catch (e) {
              // try to extract JSON substring
              const m = String(text).match(/\{[\s\S]*\}/m);
              if (m) {
                try {
                  modelResponse = JSON.parse(m[0]);
                } catch (ee) {
                  modelResponse = null;
                }
              } else {
                modelResponse = null;
              }
            }
          } else {
            const res = await (globalThis as any).fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
              },
              body: JSON.stringify({ action: 'takeTest', payload }),
            });
            modelResponse = await res.json();
          }
        } catch (e) {
          this.logger.warn('AI model request failed, falling back to heuristic: ' + String(e));
        }
      }

      // Fallback heuristic: choose first answer for each question and simple report
      let solutions: { questionId: number; userAnswers: number[] }[] = [];
      let report: any = null;

      console.log('Model response for takeTest:', modelResponse);

      if (modelResponse && modelResponse.solutions) {
        solutions = modelResponse.solutions;
        report = modelResponse.report || null;
      } else {
        solutions = test.questions.map((q: any) => ({
          questionId: q.id,
          userAnswers: [q.answers[0]?.id || 0],
        }));
        report = {
          summary:
            'Used simple heuristic (first answer) because no AI model configured or request failed.',
          questions: test.questions.map((q: any) => ({
            questionId: q.id,
            validity: 'unknown',
            note: 'No model analysis available',
          })),
        };
      }

      // Normalize model solutions -> array of { questionId, userAnswers: number[] }
      const answersByQuestion = new Map<number, { id: number; text: string }[]>();
      for (const q of test.questions) {
        answersByQuestion.set(
          q.id,
          (q.answers || []).map((a: any) => ({
            id: a.id,
            text: String(a.answerText || '').trim(),
          })),
        );
      }

      const parsedSolutions: { questionId: number; userAnswers: number[] }[] = [];
      if (Array.isArray(solutions) && solutions.length > 0) {
        for (const s of solutions) {
          const qId = Number(s.questionId) || Number(s.questionId || 0);
          let userAnswersRaw = s.userAnswers || [];
          // If model returned objects like {answerId, answerText} or strings/numbers
          const parsedIds: number[] = [];
          for (const entry of userAnswersRaw as any[]) {
            if (entry == null) continue;
            if (typeof entry === 'number') {
              parsedIds.push(entry as number);
              continue;
            }
            if (typeof entry === 'string') {
              const n = Number(String(entry).trim());
              if (!Number.isNaN(n) && n > 0) {
                parsedIds.push(n);
                continue;
              }
              // try to match by text
              const candidates = answersByQuestion.get(qId) || [];
              const match = candidates.find(
                (c) => c.text.toLowerCase() === String(entry).trim().toLowerCase(),
              );
              if (match) {
                parsedIds.push(match.id);
                continue;
              }
            }
            if (typeof entry === 'object') {
              const ent: any = entry as any;
              // common shapes: { answerId: 12 } or { id: 12 } or { answerText: '...' }
              if (ent.answerId || ent.id) {
                const n = Number(ent.answerId || ent.id);
                if (!Number.isNaN(n) && n > 0) {
                  parsedIds.push(n);
                  continue;
                }
              }
              if (ent.answerText || ent.text) {
                const txt = String(ent.answerText || ent.text || '').trim();
                const candidates = answersByQuestion.get(qId) || [];
                const match = candidates.find((c) => c.text.toLowerCase() === txt.toLowerCase());
                if (match) {
                  parsedIds.push(match.id);
                  continue;
                }
              }
            }
          }

          // fallback: if parsedIds empty, try to map by index (e.g., [1,2] meaning 1st,2nd variant)
          if (
            parsedIds.length === 0 &&
            Array.isArray(userAnswersRaw) &&
            userAnswersRaw.length > 0
          ) {
            const candidates = answersByQuestion.get(qId) || [];
            for (const entry of userAnswersRaw as any[]) {
              const n = Number(String(entry));
              if (!Number.isNaN(n) && n > 0) {
                // if n matches an answer id, keep, otherwise interpret as 1-based index
                const hasId = candidates.find((c) => c.id === n);
                if (hasId) {
                  parsedIds.push(n);
                } else {
                  const idx = Math.max(0, Math.min(candidates.length - 1, n - 1));
                  if (candidates[idx]) parsedIds.push(candidates[idx].id);
                }
              }
            }
          }

          // final fallback: pick first answer for that question
          if (parsedIds.length === 0) {
            const candidates = answersByQuestion.get(qId) || [];
            if (candidates[0]) parsedIds.push(candidates[0].id);
          }

          // unique
          const uniq = Array.from(new Set(parsedIds.filter((x) => !!x)));
          parsedSolutions.push({ questionId: qId, userAnswers: uniq });
        }
      } else {
        // no model solutions, use heuristic (first answer)
        parsedSolutions.push(
          ...test.questions.map((q: any) => ({
            questionId: q.id,
            userAnswers: [q.answers[0]?.id || 0],
          })),
        );
      }

      // Submit result as bot user
      const result = await this.testsService.submitTestResult({
        userId: this.botUser.id,
        testId: test.id,
        subject: test.subject?.nameSubject ?? payload.test.subject ?? '',
        theme: test.theme?.nameTheme ?? payload.test.theme ?? '',
        solutions: parsedSolutions,
      });

      // persist AI report
      try {
        const metrics = this.computeMetrics('takeTest', report, modelResponse);
        await (this.prisma as any).aiReport.create({
          data: {
            action: 'takeTest',
            botUserId: this.botUser.id,
            payload: { report, modelResponse, parsedSolutions, metrics },
            resultId: result.id,
          },
        });
      } catch (e) {
        this.logger.warn('Failed to persist ai report: ' + String(e));
      }

      return { report, result };
    } finally {
      this.activeTask = false;
    }
  }

  async createTestFromModel(subjectId: number, themeId: number, questionsCount = 5): Promise<any> {
    if (!this.isAuthorized()) throw new Error('Bot not authorized');

    if (this.activeTask) throw new Error('Another bot task is in progress');
    this.activeTask = true;

    try {
      const apiUrl = this.configService.get<string>('AI_MODEL_API_URL');
      const apiKey = this.configService.get<string>('AI_MODEL_API_KEY');

      let modelResponse: any = null;
      if (apiUrl && typeof (globalThis as any).fetch === 'function') {
        try {
          const provider = this.configService.get<string>('AI_MODEL_PROVIDER') || '';
          if (provider === 'qwen') {
            const systemPrompt = CREATE_TEST_PROMPT_RU;
            const body = {
              model: this.configService.get<string>('AI_MODEL_NAME') || 'qwen-2.5',
              messages: [
                { role: 'system', content: systemPrompt },
                {
                  role: 'user',
                  content: JSON.stringify({
                    action: 'createTest',
                    payload: { subjectId, themeId, questionsCount },
                  }),
                },
              ],
              temperature: 0.8,
              max_tokens: 2000,
            } as any;
            if (this.configService.get<boolean>('AI_DEBUG')) {
              this.logger.debug('AI createTest request body: ' + JSON.stringify(body));
            }

            const res = await (globalThis as any).fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
              },
              body: JSON.stringify(body),
            });

            const json = await res.json();
            const text = json?.choices?.[0]?.message?.content || json?.data || JSON.stringify(json);
            const m = String(text).match(/\{[\s\S]*\}/m);
            if (m) {
              try {
                modelResponse = JSON.parse(m[0]);
              } catch (e) {
                modelResponse = null;
              }
            } else {
              modelResponse = null;
            }
          } else if (provider === 'ollama') {
            // Ollama for createTest
            const systemPrompt = CREATE_TEST_PROMPT_RU;
            const body = {
              model: this.configService.get<string>('AI_MODEL_NAME') || 'qwen-2.5',
              messages: [
                { role: 'system', content: systemPrompt },
                {
                  role: 'user',
                  content: JSON.stringify({
                    action: 'createTest',
                    payload: { subjectId, themeId, questionsCount },
                  }),
                },
              ],
              format: 'json',
              stream: false,
            } as any;
            if (this.configService.get<boolean>('AI_DEBUG')) {
              this.logger.debug('AI createTest request body (ollama): ' + JSON.stringify(body));
            }

            const res = await (globalThis as any).fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
              },
              body: JSON.stringify(body),
            });

            const json = await res.json();
            const text = json?.message?.content || JSON.stringify(json);
            try {
              modelResponse = typeof text === 'string' ? JSON.parse(text) : text;
            } catch (e) {
              const m = String(text).match(/\{[\s\S]*\}/m);
              if (m) {
                try {
                  modelResponse = JSON.parse(m[0]);
                } catch (ee) {
                  modelResponse = null;
                }
              } else {
                modelResponse = null;
              }
            }
          } else {
            const res = await (globalThis as any).fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
              },
              body: JSON.stringify({
                action: 'createTest',
                payload: { subjectId, themeId, questionsCount },
              }),
            });
            modelResponse = await res.json();
          }
        } catch (e) {
          this.logger.warn(
            'AI model request failed, cannot create test automatically: ' + String(e),
          );
        }
      }

      // If model produced test structure, create it; otherwise return informative message
      if (modelResponse && modelResponse.test) {
        // modelResponse.test should contain name, questions[] with answers and isCorrect flags
        // enforce test scoring rules: each question = 1 point, maxPoints = questionsCount
        const created = await this.testsService.createTest({
          authorId: this.botUser.id,
          subjectId,
          themeId,
          name: modelResponse.test.name || 'AI generated test',
          maxPoints: questionsCount,
        });

        // create questions/answers
        for (const q of modelResponse.test.questions || []) {
          // force 1 point per question
          const createdQ: any = await this.testsService.createQuestion({
            testId: created.id,
            questionText: q.text,
            additionInfo: q.additionInfo || '',
            questionPoints: 1,
          } as any);

          for (const a of q.answers || []) {
            await this.testsService.createAnswer({
              questionId: createdQ.id,
              answerText: a.text,
              isCorrect: !!a.isCorrect,
            });
          }
        }

        // persist ai report for created test (include computed metrics)
        try {
          const metrics = this.computeMetrics('createTest', null, modelResponse);
          await (this.prisma as any).aiReport.create({
            data: {
              action: 'createTest',
              botUserId: this.botUser.id,
              payload: { modelResponse, createdTestId: created.id, metrics },
              resultId: null,
            },
          });
        } catch (e) {
          this.logger.warn('Failed to persist ai createTest report: ' + String(e));
        }

        return { success: true, testId: created.id };
      }

      return {
        success: false,
        message: 'AI model not configured or failed to return test structure',
      };
    } finally {
      this.activeTask = false;
    }
  }

  async getReports(page = 1, pageSize = 10, includeTakeTest = true, includeCreateTest = true) {
    try {
      const where: any = {};
      const actions: string[] = [];
      if (includeTakeTest) actions.push('takeTest');
      if (includeCreateTest) actions.push('createTest');
      if (actions.length > 0) where.action = { in: actions };

      const totalCount = await (this.prisma as any).aiReport.count({ where });

      const rows = await (this.prisma as any).aiReport.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { botUser: true, result: true },
      });

      return { items: rows, totalCount };
    } catch (e) {
      this.logger.warn('Failed to load ai reports: ' + String(e));
      return { items: [], totalCount: 0 };
    }
  }

  private computeMetrics(
    action: string,
    report: any,
    modelResponse: any,
  ): { analyticity: number; creativity: number } {
    let analyticity = 50;
    let creativity = 50;

    try {
      if (report && Array.isArray(report.questions) && report.questions.length > 0) {
        const totalQ = report.questions.length;
        const totalIssues = report.questions.reduce(
          (acc: number, q: any) => acc + (Array.isArray(q.issues) ? q.issues.length : 0),
          0,
        );
        analyticity = Math.max(0, Math.round(((totalQ - totalIssues) / totalQ) * 100));
      }

      if (action === 'createTest') {
        const questions = modelResponse?.test?.questions || report?.questions || [];
        if (questions.length > 0) {
          const avgWords =
            questions.reduce(
              (acc: number, q: any) =>
                acc +
                (q.text || q.questionText || '').split('\n').join(' ').split(/\s+/).filter(Boolean)
                  .length,
              0,
            ) / questions.length;
          creativity = Math.min(100, Math.round((avgWords / 15) * 100));
        }
      } else if (action === 'takeTest') {
        const solutions = modelResponse?.solutions || [];
        if (solutions.length > 0) {
          const avgAnswers =
            solutions.reduce(
              (acc: number, s: any) =>
                acc + (Array.isArray(s.userAnswers) ? s.userAnswers.length : 0),
              0,
            ) / solutions.length;
          creativity = Math.min(100, Math.round((avgAnswers / 3) * 100 * 0.8 + 20));
        }
      }
    } catch (e) {
      this.logger.warn('Failed to compute metrics: ' + String(e));
    }

    analyticity = Math.max(0, Math.min(100, analyticity));
    creativity = Math.max(0, Math.min(100, creativity));

    return { analyticity, creativity };
  }
}
