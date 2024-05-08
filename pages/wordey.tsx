import React, { useState, useEffect } from 'react';

// Interface to define the props type for the component.
interface WordeyProps {
    playableWords: string[];
    guessableWords: string[];
}

function Wordey({ playableWords, guessableWords }: WordeyProps) {
    const [currentWord, setCurrentWord] = useState('');
    const [guesses, setGuesses] = useState(Array(6).fill(""));
    const [styles, setStyles] = useState(Array(6).fill(Array(5).fill("bg-zinc-900 border-solid border-2 border-zinc-800 rounded-none")));
    const [currentRow, setCurrentRow] = useState(0);
    const [gameStatus, setGameStatus] = useState('');
    const [invalidWordVisible, setInvalidWordVisible] = useState(false);
    const [shakeRow, setShakeRow] = useState(-1);  // Initialize with -1, meaning no row is shaking
    const [debugMode, setDebugMode] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);

    function resetGame() {
        setCurrentWord(playableWords[Math.floor(Math.random() * playableWords.length)]);
        setGuesses(Array(6).fill(""));
        setStyles(Array(6).fill(Array(5).fill("bg-zinc-800 border-solid border-2 border-zinc-700 rounded-none")));
        setCurrentRow(0);
        setGameStatus('');
        setInvalidWordVisible(false);
        setIsGameOver(false);
        setShakeRow(-1);
    };

    useEffect(() => {
        resetGame();
    }, [playableWords]);

    useEffect(() => {
        if (shakeRow !== -1) {
            const timerId = setTimeout(() => {
                setShakeRow(-1);
            }, 820);  // Match the duration of the shake animation
            return () => clearTimeout(timerId);
        }
    }, [shakeRow]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && guesses[currentRow].length === 5) {
                if (isValidWord(guesses[currentRow])) {
                    submitGuess();
                } else {
                    setInvalidWordVisible(true);
                    setShakeRow(currentRow);  // Set the current row to shake
                }
            } else if (event.key === 'Backspace' && guesses[currentRow].length > 0) {
                setGuesses(guesses => guesses.map((g, idx) => idx === currentRow ? g.slice(0, -1) : g));
            } else if (/^[a-zA-Z]$/.test(event.key) && guesses[currentRow].length < 5) {
                setGuesses(guesses => guesses.map((g, idx) => idx === currentRow ? g + event.key.toLowerCase() : g));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentRow, guesses]);

    const isValidWord = (word) => {
        return playableWords.includes(word.toLowerCase()) || guessableWords.includes(word.toLowerCase());
    };

    const submitGuess = () => {
        const newStyles = guesses[currentRow].split('').map((char, idx) => getTileStyle(char, idx, currentWord, guesses[currentRow]));
        setStyles(styles => styles.map((s, idx) => idx === currentRow ? newStyles : s));

        if (guesses[currentRow] === currentWord) {
            setGameStatus('You won!');
            setIsGameOver(true);
        } else if (currentRow < 5) {
            setCurrentRow(currentRow + 1);
            setGameStatus('Try again');
        } else {
            setGameStatus('Game over');
            setIsGameOver(true);
        }
    };

    function getTileStyle(char, idx, currentWord, guess) {
        if (char === currentWord[idx]) {
            return "bg-green-600 rounded-none"; // Correct position
        } else if (currentWord.includes(char)) {
            const letterCountInWord = currentWord.split('').filter(x => x === char).length;
            const letterCountInGuess = guess.slice(0, idx).split('').filter(x => x === char).length;
            if (letterCountInGuess < letterCountInWord) {
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
                {guesses.map((guess, rowIndex) => (
                    <div key={rowIndex} className={`grid grid-cols-5 gap-2 ${shakeRow === rowIndex ? 'animate-shake' : ''}`}>
                        {Array.from({ length: 5 }).map((_, colIndex) => (
                            <div key={colIndex} className={`w-12 h-12 flex items-center justify-center text-xl font-bold uppercase rounded ${styles[rowIndex][colIndex]} text-zinc-100`}>
                                {guess[colIndex] && guess[colIndex].toUpperCase() || ""}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {invalidWordVisible && (
                <p className="text-center text-lg mt-4 text-red-500 fade-out">Invalid Word</p>
            )}
            <p className="text-center text-lg mt-4 text-gray-600">{gameStatus}</p>
            {isGameOver && (
                <button onClick={resetGame} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-none">NEW GAME</button>
            )}
        </div>
    );
}

export default Wordey;
