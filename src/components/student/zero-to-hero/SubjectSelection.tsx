import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BookOpen, Brain, MessageSquare, Globe, Computer } from 'lucide-react';
import { useZeroToHero, WeakArea } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';

const SubjectSelection = () => {
  const { selectSubjectsAndWeakAreas } = useZeroToHero();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [weakAreas, setWeakAreas] = useState<Record<string, string[]>>({});

  const subjects = [
    {
      name: 'Quantitative Aptitude',
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100',
      topics: ['Number Systems', 'Percentages', 'Profit & Loss', 'Time & Work', 'Data Interpretation']
    },
    {
      name: 'Reasoning',
      icon: Brain,
      color: 'text-purple-600 bg-purple-100',
      topics: ['Verbal Reasoning', 'Non-Verbal Reasoning', 'Puzzles', 'Seating Arrangement', 'Blood Relations']
    },
    {
      name: 'English',
      icon: MessageSquare,
      color: 'text-green-600 bg-green-100',
      topics: ['Grammar', 'Vocabulary', 'Reading Comprehension', 'Error Detection', 'Sentence Improvement']
    },
    {
      name: 'General Awareness',
      icon: Globe,
      color: 'text-orange-600 bg-orange-100',
      topics: ['Current Affairs', 'Banking Awareness', 'History', 'Geography', 'Economics']
    },
    {
      name: 'Computer',
      icon: Computer,
      color: 'text-red-600 bg-red-100',
      topics: ['Computer Fundamentals', 'MS Office', 'Internet & Networking', 'Computer Abbreviations', 'Software & Hardware']
    }
  ];

  const toggleSubject = (subjectName: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectName) 
        ? prev.filter(s => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  const toggleWeakTopic = (subject: string, topic: string) => {
    setWeakAreas(prev => {
      const subjectTopics = prev[subject] || [];
      const updated = subjectTopics.includes(topic)
        ? subjectTopics.filter(t => t !== topic)
        : [...subjectTopics, topic];
      return { ...prev, [subject]: updated };
    });
  };

  const handleGeneratePathway = () => {
    if (selectedSubjects.length === 0) {
      toast({
        title: 'Select Subjects',
        description: 'Please select at least one subject to continue.',
        type: 'error'
      });
      return;
    }

    const weakAreasArray: WeakArea[] = selectedSubjects.map(subject => ({
      subject,
      topics: weakAreas[subject] || []
    }));

    selectSubjectsAndWeakAreas(selectedSubjects, weakAreasArray);
    
    toast({
      title: 'Pathway Generated! 🚀',
      description: 'Your personalized learning plan is ready.',
      type: 'success'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Personalize Your Learning</h2>
        <p className="text-gray-600">Select subjects and mark your weak areas for focused improvement</p>
      </div>

      <div className="space-y-6">
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.includes(subject.name);
          const SubjectIcon = subject.icon;

          return (
            <Card key={subject.name} className={`border-2 transition-all ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Checkbox 
                    id={subject.name}
                    checked={isSelected}
                    onCheckedChange={() => toggleSubject(subject.name)}
                  />
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${subject.color}`}>
                    <SubjectIcon className="h-6 w-6" />
                  </div>
                  <Label htmlFor={subject.name} className="text-xl font-semibold cursor-pointer">
                    {subject.name}
                  </Label>
                </div>
              </CardHeader>

              {isSelected && (
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Select Weak Topics:</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {subject.topics.map((topic) => (
                        <div key={topic} className="flex items-center gap-2">
                          <Checkbox 
                            id={`${subject.name}-${topic}`}
                            checked={weakAreas[subject.name]?.includes(topic) || false}
                            onCheckedChange={() => toggleWeakTopic(subject.name, topic)}
                          />
                          <Label 
                            htmlFor={`${subject.name}-${topic}`}
                            className="text-sm cursor-pointer"
                          >
                            {topic}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-6">
        <Button 
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12"
          onClick={handleGeneratePathway}
          disabled={selectedSubjects.length === 0}
        >
          Generate My Pathway
        </Button>
      </div>
    </div>
  );
};

export default SubjectSelection;
