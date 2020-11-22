/* eslint-disable */
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import QuestionList from '../components/Edit/QuestionList';
import { List, IconButton, Button } from '@material-ui/core';

configure({ adapter: new Adapter() });
describe('Questions List', () => {

    let questions = [
        {
            "id": 0,
            "question": "Who was the actor in Batman?",
            "answers": [
            "Gareth Bale",
            "Christian Bale"
            ],
            "correctAnswers": [
            "Gareth Bale"
            ],
            "timer": 15,
            "points": 10,
            "answerQty": "single",
            "media": {
            "format": "none",
            "data": {}
            }
        },
        {
            "id": 1,
            "question": "Who was the actor in Spiderman?",
            "answers": [
            "Real",
            "Fake"
            ],
            "correctAnswers": [
            "Fake"
            ],
            "timer": 15,
            "points": 10,
            "answerQty": "single",
            "media": {
            "format": "none",
            "data": {}
            }
        },
    ];

    const handleDeleteClick = jest.fn();
    const handleQuestionClick = jest.fn();
    const handleAddClick = jest.fn();

    let questionListWrapper = shallow(
        <QuestionList
            handleAddClick={handleAddClick}
            handleDeleteClick={handleDeleteClick}
            handleQuestionClick={handleQuestionClick}
            questions={questions}
        />
    );
    it('checks if questions list exists', () => {
        expect(questionListWrapper.find(List)).toHaveLength(1);
    })

    it('checks if questions list contains all questions', () => {
        questions.forEach((q, idx) => {
            const list = questionListWrapper.find(List);
            const foundQuesiton = list.childAt(idx).first().text();
            expect(foundQuesiton).toEqual(q.question);
        })
    })

    it('checks if list is empty if there are not questions', () => {
        const newQuestionListWrapper = shallow(
            <QuestionList
                handleAddClick={handleAddClick}
                handleDeleteClick={handleDeleteClick}
                handleQuestionClick={handleQuestionClick}
                questions={[]}
            />
        );
        const list = newQuestionListWrapper.find(List);
        expect(list.children().length).toEqual(0);
    })

    it('checks if delete icon works', () => {
        const deleteIcon = questionListWrapper.find(IconButton).first();
        deleteIcon.simulate('click');
        expect(handleDeleteClick.mock.calls.length).toBe(1);
    })

    it('checks if number of questions matches number of delete icons', () => {
        const list = questionListWrapper.find(List);
        const deleteIcons = questionListWrapper.find(IconButton);
        expect(list.children().length).toEqual(deleteIcons.length);
    })

    it('checks if add new question button exists and works', () => {
        const newButton = questionListWrapper.find(Button);
        expect(newButton.exists()).toBe(true);
        newButton.simulate('click');
        expect(handleAddClick.mock.calls.length).toBe(1);
    })
})
