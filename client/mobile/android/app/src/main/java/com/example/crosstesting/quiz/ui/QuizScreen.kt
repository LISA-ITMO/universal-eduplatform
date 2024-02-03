package com.example.crosstesting.quiz.ui

import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.selection.selectable
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconToggleButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.tooling.preview.PreviewParameter
import androidx.compose.ui.tooling.preview.PreviewParameterProvider
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.crosstesting.R
import com.example.crosstesting.quiz.model.Answer
import com.example.crosstesting.quiz.model.Answers
import com.example.crosstesting.quiz.model.Question
import com.example.crosstesting.quiz.model.Quiz

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun QuizScreen(
    quiz: Quiz,
    currentQuestion: Question,
    modifier: Modifier = Modifier,
    onNextButtonClick: () -> Unit,
) {

    Surface(modifier = modifier) {
        Scaffold(
            content = {
                MainContent(
                    question = currentQuestion,
                    modifier = Modifier.padding(it)
                )
            },
            bottomBar = {
                BottomNavigation(onNextButtonClick = onNextButtonClick)
            }
        )
    }
}

@Composable
private fun MainContent(
    question: Question,
    modifier: Modifier,
) {
    Column(
        modifier = modifier.padding(start = 20.dp, end = 20.dp, top = 20.dp),
    ) {
        QuestionText(text = question.questionText)
        Spacer(modifier = Modifier.height(16.dp))
        when (question) {
            is Question.Single -> SingleAnswerList(answers = question.answers)
            is Question.Multiple -> MultipleAnswerList(answers = question.answers)
        }
    }
}

@Composable
private fun SingleAnswerList(answers: Answers) {
    var currentChosenAnswer by remember { mutableStateOf(Answer.Id("-1")) }
    val context = LocalContext.current
    when (answers) {
        is Answers.TextItems -> {
            LazyColumn {
                itemsIndexed(items = answers.items) { index, item ->
                    AnswerTextItem(
                        item = item,
                        isChosen = currentChosenAnswer == item.id,
                        isSingle = true,
                        onClick = {
                            currentChosenAnswer = it.id
                            Toast.makeText(
                                context,
                                currentChosenAnswer.toString(),
                                Toast.LENGTH_SHORT
                            ).show()
                        },
                    )
                }
            }
        }

        is Answers.ImageItems -> {
            LazyColumn {
                itemsIndexed(items = answers.items) { index, item ->
                    AnswerImageItem(
                        item = item,
                        isChosen = currentChosenAnswer == item.id,
                        isSingle = true,
                        onClick = {
                            currentChosenAnswer = it.id
                        },
                    )
                }
            }
        }
    }
}

@Composable
private fun MultipleAnswerList(answers: Answers) {
    val currentChosenAnswers = remember { mutableStateListOf<Answer.Id>() }
    val context = LocalContext.current
    when (answers) {
        is Answers.TextItems -> {
            LazyColumn {
                itemsIndexed(items = answers.items) { index, item ->
                    AnswerTextItem(
                        item = item,
                        isChosen = currentChosenAnswers.contains(item.id),
                        isSingle = false,
                        onClick = {
                            if (currentChosenAnswers.contains(it.id)) {
                                currentChosenAnswers.remove(it.id)
                            } else {
                                currentChosenAnswers.add(it.id)
                            }
                            Toast.makeText(
                                context,
                                currentChosenAnswers.toList().toString(),
                                Toast.LENGTH_SHORT
                            ).show()
                        },
                    )
                }
            }
        }

        is Answers.ImageItems -> {
            LazyRow {
                itemsIndexed(items = answers.items) { index, item ->
                    AnswerImageItem(
                        item = item,
                        isChosen = currentChosenAnswers.contains(item.id),
                        isSingle = false,
                        onClick = {
                            if (currentChosenAnswers.contains(it.id)) {
                                currentChosenAnswers.remove(it.id)
                            } else {
                                currentChosenAnswers.add(it.id)
                            }
                        },
                    )
                }
            }
        }
    }
}

@Composable
private fun AnswerTextItem(
    item: Answer.Text,
    onClick: (Answer.Text) -> Unit,
    isChosen: Boolean,
    isSingle: Boolean,
) {
    Surface(
        shape = MaterialTheme.shapes.small,
        border = BorderStroke(
            width = 1.dp,
            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
        ),
        modifier = Modifier.padding(vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .selectable(
                    selected = isChosen,
                    onClick = { onClick(item) },
                )
//                .background(answerBackgroundColor)
                .padding(end = 16.dp, top = 20.dp, bottom = 20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconToggleButton(
                modifier = Modifier.clickable { onClick(item) },
                checked = isChosen,
                onCheckedChange = { },
                content = {
                    Icon(
                        modifier = Modifier.clickable { onClick(item) },
                        painter = painterResource(
                            when {
                                isChosen && !isSingle -> R.drawable.baseline_check_box_24
                                isChosen && isSingle -> R.drawable.baseline_check_circle_24
                                !isChosen && isSingle -> R.drawable.outline_circle_24
                                else -> R.drawable.baseline_check_box_outline_blank_24
                            }
                        ),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            )
            Text(
                modifier = Modifier.weight(1f),
                text = item.text
            )
        }
    }
}

@Composable
private fun AnswerImageItem(
    item: Answer.Image,
    onClick: (Answer.Image) -> Unit,
    isChosen: Boolean,
    isSingle: Boolean,
) {
    Surface(
        shape = MaterialTheme.shapes.small,
        border = BorderStroke(
            width = 1.dp,
            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.5f)
        ),
        modifier = Modifier.padding(vertical = 8.dp)
    ) {
        Column(
            modifier = Modifier.clickable(onClick = { onClick(item) }),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            AsyncImage(
                modifier = Modifier
                    .size(200.dp)
                    .padding(vertical = 10.dp),
                contentScale = ContentScale.Crop,
                model = item.url,
                contentDescription = null,
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                IconToggleButton(
                    modifier = Modifier.clickable { onClick(item) },
                    checked = isChosen,
                    onCheckedChange = { },
                    content = {
                        Icon(
                            modifier = Modifier.clickable { onClick(item) },
                            painter = painterResource(
                                when {
                                    isChosen && !isSingle -> R.drawable.baseline_check_box_24
                                    isChosen && isSingle -> R.drawable.baseline_check_circle_24
                                    !isChosen && isSingle -> R.drawable.outline_circle_24
                                    else -> R.drawable.baseline_check_box_outline_blank_24
                                }
                            ),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                        )
                    }
                )
                if (item.text != null) {
                    Text(
                        modifier = Modifier.weight(1f),
                        text = item.text,
                    )
                }
            }
        }
    }
}

@Composable
private fun QuestionText(text: String) {
    val backgroundColor = if (isSystemInDarkTheme()) {
        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.06f)
    } else {
        MaterialTheme.colorScheme.onSurface.copy(alpha = 0.04f)
    }
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                color = backgroundColor,
                shape = MaterialTheme.shapes.small
            )
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.bodyLarge,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 24.dp, horizontal = 16.dp)
        )
    }
}

@Composable
private fun BottomNavigation(
    modifier: Modifier = Modifier,
    onNextButtonClick: () -> Unit,
) {
    Row(
        modifier = modifier.fillMaxWidth()
    ) {
        Button(
            modifier = Modifier.fillMaxWidth(),
            onClick = onNextButtonClick,
        ) {
            Text(text = "Следующий вопрос")
        }

    }
}

@Preview
@Composable
fun QuizScreenPreview(
    @PreviewParameter(QuestionStateProvider::class) state: Question,
) {
    //QuizScreen(question = state)
}

//TODO
class QuestionStateProvider : PreviewParameterProvider<Question> {

    val singleTextQuestion: Question = Question.Single(
        id = "1",
        questionText = "Какой язык является основным для андроид разработки в 2023 году?",
        answers = Answers.TextItems(
            listOf(
                Answer.Text(
                    id = Answer.Id("1"),
                    text = "KotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlin"
                ),
                Answer.Text(
                    id = Answer.Id("2"),
                    text = "Java"
                ),
                Answer.Text(
                    id = Answer.Id("3"),
                    text = "C++"
                ),
                Answer.Text(
                    id = Answer.Id("4"),
                    text = "Python"
                ),
                Answer.Text(
                    id = Answer.Id("5"),
                    text = "Swift"
                ),
                Answer.Text(
                    id = Answer.Id("6"),
                    text = "C#"
                ),
            ),
        ),
        correctAnswerId = Answer.Id("1"),
    )

    val multipleTextQuestion: Question = Question.Multiple(
        id = "1",
        questionText = "Какой язык является основным для андроид разработки в 2023 году?",
        answers = Answers.TextItems(
            listOf(
                Answer.Text(
                    id = Answer.Id("1"),
                    text = "KotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlin"
                ),
                Answer.Text(
                    id = Answer.Id("2"),
                    text = "Java"
                ),
                Answer.Text(
                    id = Answer.Id("3"),
                    text = "C++"
                ),
                Answer.Text(
                    id = Answer.Id("4"),
                    text = "Python"
                ),
                Answer.Text(
                    id = Answer.Id("5"),
                    text = "Swift"
                ),
                Answer.Text(
                    id = Answer.Id("6"),
                    text = "C#"
                ),
            ),
        ),
        correctAnswersId = listOf(Answer.Id("1")),
    )

    val imageQuestion: Question = Question.Single(
        id = "1",
        questionText = "Какой язык является основным для андроид разработки в 2023 году?",
        answers = Answers.ImageItems(
            listOf(
                Answer.Image(
                    id = Answer.Id("1"),
                    text = "KotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlinKotlin",
                    url = "https://www.allrecipes.com/thmb/WqWggh6NwG-r8PoeA3OfW908FUY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21014-Good-old-Fashioned-Pancakes-mfs_001-1fa26bcdedc345f182537d95b6cf92d8.jpg",
                ),
                Answer.Image(
                    id = Answer.Id("2"),
                    text = "Java",
                    url = "https://www.allrecipes.com/thmb/WqWggh6NwG-r8PoeA3OfW908FUY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21014-Good-old-Fashioned-Pancakes-mfs_001-1fa26bcdedc345f182537d95b6cf92d8.jpg",
                ),
                Answer.Image(
                    id = Answer.Id("3"),
                    text = "C++",
                    url = "https://www.allrecipes.com/thmb/WqWggh6NwG-r8PoeA3OfW908FUY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21014-Good-old-Fashioned-Pancakes-mfs_001-1fa26bcdedc345f182537d95b6cf92d8.jpg",
                ),
                Answer.Image(
                    id = Answer.Id("4"),
                    text = "Python",
                    url = "https://www.allrecipes.com/thmb/WqWggh6NwG-r8PoeA3OfW908FUY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21014-Good-old-Fashioned-Pancakes-mfs_001-1fa26bcdedc345f182537d95b6cf92d8.jpg",
                ),
                Answer.Image(
                    id = Answer.Id("5"),
                    text = "Swift",
                    url = "https://www.allrecipes.com/thmb/WqWggh6NwG-r8PoeA3OfW908FUY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21014-Good-old-Fashioned-Pancakes-mfs_001-1fa26bcdedc345f182537d95b6cf92d8.jpg",
                ),
                Answer.Image(
                    id = Answer.Id("6"),
                    text = "C#",
                    url = "https://www.allrecipes.com/thmb/WqWggh6NwG-r8PoeA3OfW908FUY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21014-Good-old-Fashioned-Pancakes-mfs_001-1fa26bcdedc345f182537d95b6cf92d8.jpg",
                ),
            ),
        ),
        correctAnswerId = Answer.Id("1"),
    )

    override val values: Sequence<Question>
        get() = sequenceOf(imageQuestion, singleTextQuestion, multipleTextQuestion)
}