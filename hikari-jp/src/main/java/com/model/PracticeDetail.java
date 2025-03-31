package com.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Practice_Detail")
public class PracticeDetail {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int practice_detail_id;

        @ManyToOne
        @JoinColumn(name = "practice_id", nullable = false)
        private Practice practice;

        @ManyToOne
        @JoinColumn(name = "test_question_id", nullable = false)
        private TestQuestion testQuestion;

        // Getter & Setter


        public PracticeDetail(int id, TestQuestion testQuestion, Practice practice) {
                this.practice_detail_id = id;
                this.testQuestion = testQuestion;
                this.practice = practice;
        }

        public PracticeDetail() {}
        public int getId() {
                return practice_detail_id;
        }

        public void setId(int id) {
                this.practice_detail_id = id;
        }

        public TestQuestion getTestQuestion() {
                return testQuestion;
        }

        public void setTestQuestion(TestQuestion testQuestion) {
                this.testQuestion = testQuestion;
        }

        public Practice getPractice() {
                return practice;
        }

        public void setPractice(Practice practice) {
                this.practice = practice;
        }
}
