import reducer from './reducer';
import { generateAuralUpdate, restartGame, makeGuess } from './actions';

describe('hot-cold-reducer', () => {
    it('Should set the initial state when nothing is passed in', () => {
        const state = reducer(undefined, { type: "__UNKNOWN" });
        expect(state.guesses).toEqual([]);
        expect(state.feedback).toEqual('Make your guess!')
        expect(state.auralStatus).toEqual('');
        expect(state.correctAnswer).toBeLessThan(102);
        expect(state.correctAnswer).toBeGreaterThan(0)
    });

    it('Should return the current state of an unknown action', () => {
        let currentState = {};
        const state = reducer(currentState, { type: '__UNKNOWN' });
        expect(state).toBe(currentState);
    });

    describe('restartGame', () => {
        it('Should start a new game', () => {
            let state = {
                guesses: [1, 5, 74, 85],
                feedback: 'Awesome',
                correctAnswer: 85
            };
            const correctAnswer = 42;
            state = reducer(state, restartGame(correctAnswer));
            expect(state.guesses).toEqual([]);
            expect(state.feedback).toEqual('Make your guess!')
            expect(state.auralStatus).toEqual('');
            expect(state.correctAnswer).toEqual(correctAnswer);
        });
    });

    describe('makeGuess', () => {
        it('Should make a guess', () => {
            let state = {
                guesses: [],
                feedback: '',
                correctAnswer: 100
            };

            state = reducer(state, makeGuess(42));
            expect(state.guesses).toEqual([42]);
            expect(state.feedback).toEqual(`You're Ice Cold...`);

            state = reducer(state, makeGuess(65));
            expect(state.guesses).toEqual([42, 65]);
            expect(state.feedback).toEqual(`You're Cold...`);

            state = reducer(state, makeGuess(89));
            expect(state.guesses).toEqual([42, 65, 89]);
            expect(state.feedback).toEqual(`You're Warm.`);

            state = reducer(state, makeGuess(95));
            expect(state.guesses).toEqual([42, 65, 89, 95]);
            expect(state.feedback).toEqual(`You're Hot!`);

            state = reducer(state, makeGuess(100));
            expect(state.guesses).toEqual([42, 65, 89, 95, 100]);
            expect(state.feedback).toEqual('You got it!');
        });

        it('Can generate aural updates', () => {
            let state = {
                guesses: [53, 1, 75],
                feedback: `You're Warm.`,
                auralStatus: ''
            }

            state = reducer(state, generateAuralUpdate());
            expect(state.auralStatus).toEqual("Here's the status of the game right now: You're Warm. You've made 3 guesses. In order of most- to least-recent, they are: 75, 1, 53")
        });
    });
});