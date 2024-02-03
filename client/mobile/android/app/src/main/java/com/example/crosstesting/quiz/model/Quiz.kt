package com.example.crosstesting.quiz.model

import java.io.Serializable

data class Quiz(
    val id: String,
    val questions: List<Question>,
)

sealed interface Question {
    val id: String
    val questionText: String
    val answers: Answers

    data class Single(
        override val id: String,
        override val questionText: String,
        override val answers: Answers,
        val correctAnswerId: Answer.Id,
    ): Question

    data class Multiple(
        override val id: String,
        override val questionText: String,
        override val answers: Answers,
        val correctAnswersId: List<Answer.Id>,
    ): Question
}

sealed interface Answers {
    val items: List<Answer>

    data class TextItems(
        override val items: List<Answer.Text>
    ): Answers

    data class ImageItems(
        override val items: List<Answer.Image>
    ): Answers
}

sealed interface Answer {
    val id: Id

    data class Text(
        override val id: Id,
        val text: String,
    ): Answer

    data class Image(
        override val id: Id,
        val url: String,
        val text: String?,
    ): Answer

    data class Id(val raw: String): Serializable
}
