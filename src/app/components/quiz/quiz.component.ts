import { Component, OnInit } from '@angular/core';
import quiz_questions from '../../../assets/data/quiz_questions.json';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  title: string = "";

  questions: any;
  selectedQuestion: any;
  questionImage: string = "";

  answers: string[] = [];
  selectedAnswer: string = "";

  questionIndex: number = 0;
  questionMax: number = 0;

  finished: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (quiz_questions) {
      this.finished = false;
      this.title = quiz_questions.title;

      this.questions = quiz_questions.questions;
      this.questionImage = this.questions[this.questionIndex].image;
      this.selectedQuestion = this.questions[this.questionIndex];

      this.questionIndex = 0;
      this.questionMax = this.questions.length;
    }
  }

  selectOption(value: string) {
    this.answers.push(value);
    this.nextQuestion();
  }

  async nextQuestion() {
    this.questionIndex++;

    if (this.questionMax > this.questionIndex) {
      this.selectedQuestion = this.questions[this.questionIndex];
      this.questionImage = this.questions[this.questionIndex].image;
    } else {
      const finalResult: string = await this.checkResults(this.answers);
      this.finished = true;

      const resultObj = quiz_questions.results[finalResult as keyof
        typeof quiz_questions.results];
      
      this.selectedAnswer = resultObj.text;

      this.questionImage = resultObj.image;
    }
  }

  async checkResults(answers: string[]) {
    const result = answers.reduce((previous, current, i, arr) => {
      if(
        arr.filter(item => item === previous).length >
        arr.filter(item => item === current).length
      ) {
        return previous;
      } else {
        return current;
      }
    });

    return result;
  }
}
