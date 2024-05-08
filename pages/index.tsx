import React from 'react';
import fs from 'fs';
import path from 'path';
import Wordey from './wordey';

interface WordsProps {
    playableWords: string[];
    guessableWords: string[];
}

export default function Home({ playableWords, guessableWords }: WordsProps) {
  return (
    <div>
      <Wordey playableWords={playableWords} guessableWords={guessableWords} />
    </div>
  );
}

export async function getServerSideProps() {
    const playableWords = fs.readFileSync(path.join(process.cwd(), 'public', 'wordle-La.txt'), 'utf-8').split('\n');
    const guessableWords = fs.readFileSync(path.join(process.cwd(), 'public', 'wordle-Ta.txt'), 'utf-8').split('\n');

    return {
        props: {
            playableWords,
            guessableWords,
        },
    };
}