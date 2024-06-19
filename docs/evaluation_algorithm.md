## Algorithm for assessing individual abilities

The quiz platform determines the personal competences of a person by means of robust statistical methods. **Analytical** and **leadership** competences are defined.

### Analytical competence

**Analytical competence** refers to the ability to systematically analyse the data and information presented. In order to ensure accurate measurement of a numerical characteristic, it is expected to exclude outliers from the data set. 

> For example: a student scores 95, 89 and 20 on several tests, in which case only the values 95 and 89 would be used, while a score of 20 would be excluded as an outlier affecting the static validity of the results.

The robust mean formula for calculating the numerical characteristic of analyticity is expressed as follows:
<p align="center">
  𝑅𝑀 = 𝑚𝑒𝑑(𝑋)
</p>
where X is the set of grades received by a student for all tests.

Using this formula, the mean is calculated as the median value of all grades obtained by a student for a series of tests, and the effect of outliers on student results is minimised.

### Leadership skills

**Leadership** qualities imply the ability to find non-trivial solutions, to form interesting and sufficiently complex questions. The assessed student develops test tasks in such a way that they cause varying degrees of difficulty for other students, thus demonstrating their leadership qualities.

The formula used to calculate leadership qualities is the robust coefficient of variation, defined as the ratio of the interquartile range to the median of a vector consisting of the proportion of correct answers to each test question. The formula is expressed as follows:
<p align="center">
  𝑅𝐶𝑉 = 𝐼𝑄𝑅/𝑚𝑒𝑑(𝑋), 
</p>
where IQR is the interquartile range, X is a vector consisting of fractions of correct answers to each test question.

### Interpretation of results
Interpretation of analytical and leadership assessment results is a process of assigning categorical scores based on the value of the robust coefficient of variation (RCV) and the median (RM) of the vector of shares of correct answers to test questions. 

This approach is aimed at systematising and generalising the results obtained during the assessment of analytical and leadership skills.

At low values of the robust coefficient of variation and median, such as - less than 10 and 20, a score of `2` and `3` is established, as this indicates a low level of variation in the difficulty of questions. 

For medium and high values of robust coefficient of variation and median such as - less than 30 and more than or equal to 30, a score of `4` and `5` is set as it indicates a high level of variation and low consistency in the complexity of the questions.

| RCV < `10` | RCV < `20` | RCV < `30` | RCV ≥ `30` | 
| -------- | -------- | -------- | -------- |
| Score of `2` | Score of `3` | Score of `4` | Score of `5` | 
