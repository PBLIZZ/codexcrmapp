'use client';

import { useState } from 'react';
import { HelpCircle, ArrowRight, Plus, Trash2, CheckCircle2, CircleOff } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@codexcrm/ui';
import { Textarea } from '@codexcrm/ui';
import { Button } from '@codexcrm/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@codexcrm/ui';
interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export function QuizCreator() {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', ''], correctAnswer: 0 },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(
      newQuestions.length
        ? newQuestions
        : [{ question: '', options: ['', '', ''], correctAnswer: 0 }]
    );
  };

  const updateQuestion = (qIndex: number, text: string) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex]?.question !== undefined) {
      newQuestions[qIndex].question = text;
      setQuestions(newQuestions);
    }
  };

  const updateOption = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...questions];
    if (
      newQuestions[qIndex]?.options?.[oIndex] !== undefined
    ) {
      newQuestions[qIndex].options[oIndex] = text;
      setQuestions(newQuestions);
    }
  };

  const setCorrectAnswer = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex]) {
      newQuestions[qIndex].correctAnswer = oIndex;
      setQuestions(newQuestions);
    }
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex]?.options) {
      newQuestions[qIndex].options.push('');
      setQuestions(newQuestions);
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex]?.options && newQuestions[questionIndex].options.length > 2) {
      // Add check for undefined
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      if (newQuestions[questionIndex].correctAnswer === optionIndex) {
        newQuestions[questionIndex].correctAnswer = 0;
      } else if (newQuestions[questionIndex].correctAnswer > optionIndex) {
        newQuestions[questionIndex].correctAnswer--;
      }
      setQuestions(newQuestions);
    }
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div className='space-y-6'>
        <div className='bg-green-50 dark:bg-green-950/20 p-6 rounded-lg'>
          <h2 className='text-2xl font-bold flex items-center gap-2 mb-4 text-green-700 dark:text-green-300'>
            <HelpCircle className='h-6 w-6' />
            Quiz Creator
          </h2>
          <p className='text-muted-foreground mb-6'>
            Create engaging quizzes to qualify leads, segment your audience, or educate clients
            about your services. Interactive quizzes boost engagement and provide valuable insights
            about your audience.
          </p>

          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium mb-1 block'>Quiz Title</label>
              <Input
                type="text"
                placeholder="e.g., 'What's Your Wellness Type?' or 'Test Your Knowledge'"
                value={quizTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuizTitle(e.target.value)}
                className='bg-white dark:bg-green-950/40'
              />
            </div>

            {questions.map((question, qIndex) => (
              <Card key={qIndex} className='border-green-100 dark:border-green-900/50'>
                <CardHeader className='pb-3 bg-green-50 dark:bg-green-950/20 rounded-t-lg flex flex-row items-center justify-between'>
                  <div>
                    <CardTitle className='text-sm font-medium'>Question {qIndex + 1}</CardTitle>
                  </div>
                  {questions.length > 1 && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50'
                      onClick={() => removeQuestion(qIndex)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className='space-y-3 pt-4'>
                  <Textarea
                    placeholder='Enter your question here'
                    value={question.question}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateQuestion(qIndex, e.target.value)}
                    className='bg-white dark:bg-green-950/10'
                  />

                  <div className='space-y-2'>
                    <div className='text-sm font-medium'>Answer Options</div>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className='flex items-center gap-2'>
                        <label
                          className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 ${question.correctAnswer === oIndex ? 'bg-green-100 border-green-300 dark:bg-green-950/40 dark:border-green-800' : 'bg-white dark:bg-green-950/10'}`}
                          onClick={(e: React.MouseEvent<HTMLLabelElement>) => setCorrectAnswer(qIndex, oIndex)}
                        >
                          {question.correctAnswer === oIndex ? (
                            <CheckCircle2 className='h-4 w-4' />
                          ) : (
                            <CircleOff className='h-4 w-4' />
                          )}
                        </label>
                        <Input
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(qIndex, oIndex, e.target.value)}
                          className='bg-white dark:bg-green-950/10'
                        />
                        {question.options.length > 2 && (
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50'
                            onClick={() => removeOption(qIndex, oIndex)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    ))}
                    {question.options.length < 5 && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='mt-2 text-xs'
                        onClick={() => addOption(qIndex)}
                      >
                        <Plus className='h-3 w-3 mr-1' />
                        Add Option
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              variant='outline'
              size='default'
              className='border-dashed border-2 w-full bg-white dark:bg-green-950/10 hover:bg-green-50 dark:hover:bg-green-900/20 mb-6'
              onClick={() => addQuestion()}
            >
              <Plus className='h-4 w-4 mr-2' />
              Add Question
            </Button>

            <Button variant='default' size='default' className='w-full bg-green-600 hover:bg-green-700 text-white'>
              Create Quiz
            </Button>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <Card className='border-green-100 dark:border-green-900/50'>
          <CardHeader className='pb-3 bg-green-50 dark:bg-green-950/20 rounded-t-lg'>
            <CardTitle className='text-lg font-semibold'>Quiz Preview</CardTitle>
            <CardDescription className="">How your quiz will appear to clients</CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='space-y-6'>
              <div className='text-center'>
                <h3 className='text-xl font-bold mb-2'>{quizTitle || 'Your Quiz Title'}</h3>
                <p className='text-sm text-muted-foreground'>
                  Discover more about yourself with our interactive quiz
                </p>
              </div>

              {questions[0]?.question ? (
                <div className='border rounded-md p-4 bg-white dark:bg-green-950/10'>
                  <h4 className='font-medium mb-3'>{questions[0]?.question}</h4>
                  <div className='space-y-2'>
                    {questions[0]?.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md border cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 ${
                          index === 0
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : ''
                        }`}
                      >
                        {option || `Option ${index + 1}`}
                      </div>
                    ))}
                  </div>
                  <div className='flex justify-between mt-4'>
                    <Button variant='outline' size='sm' disabled className='text-green-600'>
                      Previous
                    </Button>
                    <Button variant='default' size='sm' className='bg-green-600 hover:bg-green-700'>
                      Next
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='border rounded-md p-4 bg-white dark:bg-green-950/10 text-center text-muted-foreground'>
                  <p className='text-gray-500 text-sm'>Add questions to see a preview</p>
                </div>
              )}

              <div className='text-sm text-muted-foreground'>
                <p>Quiz results can be used to:</p>
                <ul className='list-disc pl-5 mt-2 space-y-1'>
                  <li>Recommend specific services</li>
                  <li>Segment your email list</li>
                  <li>Personalize follow-up communications</li>
                  <li>Gather valuable audience insights</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between border-t pt-4'>
            <Button variant='outline' size='sm' asChild className='text-green-600'>
              <Link href={{ pathname: '/marketing/quiz/templates' }}>Browse Templates</Link>
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-900/30'
              asChild
            >
              <Link href={{ pathname: '/marketing/quiz' }}>
                Manage Quizzes
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className='bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-lg'>
          <h3 className='font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-300'>
            <HelpCircle className='h-4 w-4' />
            Try Our Membership Tools
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>
            Use quiz results to recommend the perfect membership tier for each client. Our
            membership tools help you create compelling programs that convert quiz takers into loyal
            members.
          </p>
          <Button
            variant='link'
            size='default'
            className='text-indigo-600 dark:text-indigo-400 p-0 h-auto mt-2'
            onClick={() =>
              document.querySelector('[value="membership"]')?.dispatchEvent(new MouseEvent('click'))
            }
          >
            Explore Membership & Loyalty
            <ArrowRight className='ml-1 h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
