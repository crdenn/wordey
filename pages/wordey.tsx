import React, { useState, useEffect } from 'react';

interface WordeyProps {
    playableWords: string[];
    guessableWords: string[];
}

const initialStyle = "bg-zinc-800 border-solid border-2 border-zinc-700 rounded-none";

function Wordey({ playableWords, guessableWords }: WordeyProps) {
    const [currentWord, setCurrentWord] = useState('');
    const [guesses, setGuesses] = useState(Array(6).fill(null).map(() => Array(5).fill("")));
    const [styles, setStyles] = useState(Array(6).fill(Array(5).fill(initialStyle)));
    const [currentRow, setCurrentRow] = useState(0);
    const [gameStatus, setGameStatus] = useState('');
    const [invalidWordVisible, setInvalidWordVisible] = useState(false);
    const [debugMode, setDebugMode] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);

    function resetGame() {
        const word = playableWords[Math.floor(Math.random() * playableWords.length)];
        setCurrentWord(word);
        setGuesses(Array(6).fill(null).map(() => Array(5).fill("")));
        setStyles(Array(6).fill(Array(5).fill(initialStyle)));
        setCurrentRow(0);
        setGameStatus('');
        setInvalidWordVisible(false);
        setIsGameOver(false);
    };

    useEffect(() => {
        resetGame();
    }, [playableWords]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && guesses[currentRow].join('').length === 5) {
                if (isValidWord(guesses[currentRow].join(''))) {
                    submitGuess();
                } else {
                    setInvalidWordVisible(true);
                }
            } else if (event.key === 'Backspace' && guesses[currentRow].join('').length > 0) {
                const updatedGuesses = [...guesses];
                updatedGuesses[currentRow][guesses[currentRow].join('').length - 1] = "";
                setGuesses(updatedGuesses);
            } else if (/^[a-zA-Z]$/.test(event.key) && guesses[currentRow].join('').length < 5) {
                const updatedGuesses = [...guesses];
                updatedGuesses[currentRow][guesses[currentRow].join('').length] = event.key.toLowerCase();
                setGuesses(updatedGuesses);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentRow, guesses]);

    const isValidWord = (word) => {
        return playableWords.includes(word.toLowerCase()) || guessableWords.includes(word.toLowerCase());
    };

    const submitGuess = () => {
        const currentGuess = guesses[currentRow].join('');
        let lastAnimationDelay = currentGuess.length * 100; // Calculate the delay for the last animation
    
        // Update styles with a delay, each cell gets updated sequentially.
        currentGuess.split('').forEach((char, idx) => {
            setTimeout(() => {
                setStyles(prevStyles => {
                    const newStyles = prevStyles.map(row => [...row]);
                    newStyles[currentRow][idx] = getTileStyle(char, idx, currentWord, currentGuess);
                    return newStyles;
                });
            }, idx * 100);
        });
    
        // Delay setting the game over status until the last animation has completed.
        setTimeout(() => {
            if (currentGuess === currentWord) {
                setIsGameOver(true);
            } else if (currentRow < 5) {
                setCurrentRow(currentRow + 1); // Prepare for the next guess.
            } else {
                setGameStatus('Game over');
                setIsGameOver(true);
            }
        }, lastAnimationDelay);
    };
    
    
    
    

    function getTileStyle(char, idx, currentWord, guess) {
        // Check if the character is in the correct position
        if (char === currentWord[idx]) {
            return "bg-green-600 rounded-none"; // Correct position
        } else if (currentWord.includes(char)) {
            // Calculate occurrences of the character in the word up to the current index
            const letterCountInWord = currentWord.split('').filter((c, i) => c === char && i <= idx).length;
            const letterCountInGuess = guess.split('').slice(0, idx + 1).filter(c => c === char).length;
            // Only mark as yellow if there are fewer or equal correct letters in the guess than in the word at that position
            if (letterCountInGuess <= letterCountInWord) {
                return "bg-yellow-500 rounded-none"; // Correct letter, wrong position
            }
        }
        return "bg-zinc-700 rounded-none"; // Incorrect letter
    }
    

    return (
        <div className="max-w-xs mx-auto mt-10 p-4 rounded-lg h-screen w-full md:w-auto md:h-auto">
            <h1 className="text-center text-2xl font-bold text-zinc-200">Wordey</h1>
            {debugMode && (
                <p className="text-center text-red-500">Debug: Current Word is "{currentWord}"</p>
            )}
            <div className="grid grid-rows-6 gap-y-2">
                {guesses.map((guessRow, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-5 gap-2">
                        {guessRow.map((char, colIndex) => (
                            <div key={colIndex} className={`w-12 h-12 flex items-center justify-center text-xl font-bold uppercase rounded ${styles[rowIndex][colIndex]} text-zinc-100`}>
                                {char.toUpperCase()}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {invalidWordVisible && (
                <p className="text-center text-lg mt-4 text-red-500 animate-fade-out">Invalid Word</p>
            )}
            <p className="text-center text-lg mt-4 text-gray-600">{gameStatus}</p>
            {isGameOver && (
                <button onClick={resetGame} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-none">NEW GAME</button>
            )}
        </div>
    );
}

export default Wordey;
