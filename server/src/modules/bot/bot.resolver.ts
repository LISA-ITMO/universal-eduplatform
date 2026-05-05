import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BotService } from './bot.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver()
export class BotResolver {
  constructor(private botService: BotService) {}

  @Query(() => Boolean)
  async aiBotAuthorized() {
    return this.botService.isAuthorized();
  }

  @Query(() => String, { nullable: true })
  async aiBotUsername() {
    return this.botService.getBotInfo().username;
  }

  @Query(() => Number, { nullable: true })
  async aiBotUserId() {
    return (this.botService.getBotInfo() as any).id ?? null;
  }

  @Query(() => String)
  @Roles(Role.admin, Role.teacher)
  async aiReports(
    @Args('page', { type: () => Int, nullable: true }) page = 1,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize = 10,
    @Args('includeTakeTest', { type: () => Boolean, nullable: true }) includeTakeTest = true,
    @Args('includeCreateTest', { type: () => Boolean, nullable: true }) includeCreateTest = true,
  ) {
    const res = await this.botService.getReports(
      page,
      pageSize,
      includeTakeTest,
      includeCreateTest,
    );
    // return JSON string to keep resolver simple
    return JSON.stringify(res);
  }

  @Query(() => Boolean)
  @Roles(Role.admin, Role.teacher)
  async aiBotActive() {
    return (this.botService as any).activeTask === true;
  }

  @Mutation(() => String)
  @Roles(Role.admin, Role.teacher)
  async authorizeAiAssistant() {
    const res = await this.botService.authorizeBot();
    if (!res.success) throw new Error(res.message);
    return res.message;
  }

  @Mutation(() => String)
  @Roles(Role.admin, Role.teacher)
  async deauthorizeAiAssistant() {
    const res = await this.botService.deauthorizeBot();
    if (!res.success) throw new Error(res.message);
    return res.message;
  }

  @Mutation(() => String)
  @Roles(Role.admin, Role.teacher)
  async aiRunTest(@Args('testId', { type: () => Int }) testId: number) {
    const r = await this.botService.takeTest(testId);
    // return simple summary for UI; detailed report is available in r.report
    return JSON.stringify({ summary: r.report?.summary || 'OK', testResultId: r.result?.id });
  }

  @Mutation(() => String)
  @Roles(Role.admin, Role.teacher)
  async aiCreateTest(
    @Args('subjectId', { type: () => Int }) subjectId: number,
    @Args('themeId', { type: () => Int }) themeId: number,
    @Args('questionsCount', { type: () => Int, nullable: true }) questionsCount = 5,
  ) {
    const r = await this.botService.createTestFromModel(subjectId, themeId, questionsCount);
    return JSON.stringify(r);
  }
}
