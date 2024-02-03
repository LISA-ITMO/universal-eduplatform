package com.example.crosstesting.quiz.ui

import androidx.lifecycle.ViewModel
import com.example.crosstesting.quiz.model.Question
import com.example.crosstesting.quiz.model.Quiz
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject

@HiltViewModel
class QuizViewModel @Inject constructor() : ViewModel() {

    private val questionStateProvider = QuestionStateProvider()
    private val questions = questionStateProvider.values.toList()
    val state: StateFlow<Quiz> = MutableStateFlow(Quiz(id = "1", questions = questions))
    val currentQuestionState: MutableStateFlow<Question> = MutableStateFlow(questions.first())

    fun nextQuestion() {
        val currentIndex = questions.indexOf(currentQuestionState.value)
        if (currentIndex + 1 >= questions.size) {
            currentQuestionState.value = questions.first()
        } else {
            currentQuestionState.value = questions[currentIndex + 1]
        }
    }
}