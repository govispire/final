import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calculator, Brain, BookOpen, Globe, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useZeroToHero, SelectedTopic } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';
import { allSyllabusData } from '@/data/syllabusData';

const SubjectSelection = () => {
  const { selectTopicsAndGeneratePlan } = useZeroToHero();
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedTopics, setSelectedTopics] = useState<Record<string, Set<string>>>({});
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  // Get available banking exams
  const availableExams = useMemo(() => {
    return Object.keys(allSyllabusData).filter(examId => {
      const exam = allSyllabusData[examId];
      return exam.category === 'banking'; // Start with banking, can expand later
    });
  }, []);

  // Get subjects and topics from selected exam
  const examData = selectedExam ? allSyllabusData[selectedExam] : null;

  const subjectsWithTopics = useMemo(() => {
    if (!examData) return [];

    const subjects: Array<{
      name: string;
      icon: any;
      iconColor: string;
      topics: Array<{ id: string; name: string }>;
    }> = [];

    // Get all tiers and subjects
    examData.tiers.forEach(tier => {
      tier.subjects.forEach(subject => {
        // Find if we already have this subject
        let existingSubject = subjects.find(s => s.name === subject.name);

        if (!existingSubject) {
          existingSubject = {
            name: subject.name,
            icon: getSubjectIcon(subject.name),
            iconColor: subject.iconBg || 'bg-gray-500',
            topics: []
          };
          subjects.push(existingSubject);
        }

        // Add topics from this subject
        subject.topics.forEach(topic => {
          if (!existingSubject!.topics.find(t => t.id === topic.id)) {
            existingSubject!.topics.push({
              id: topic.id,
              name: topic.name
            });
          }
        });
      });
    });

    return subjects;
  }, [examData]);

  const toggleSubject = (subjectName: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      if (next.has(subjectName)) {
        next.delete(subjectName);
      } else {
        next.add(subjectName);
      }
      return next;
    });
  };

  const toggleTopic = (subjectName: string, topicId: string) => {
    setSelectedTopics(prev => {
      const updated = { ...prev };
      if (!updated[subjectName]) {
        updated[subjectName] = new Set();
      }

      if (updated[subjectName].has(topicId)) {
        updated[subjectName].delete(topicId);
        if (updated[subjectName].size === 0) {
          delete updated[subjectName];
        }
      } else {
        updated[subjectName].add(topicId);
      }

      return updated;
    });
  };

  const getSelectedCount = (subjectName: string) => {
    return selectedTopics[subjectName]?.size || 0;
  };

  const getTotalTopicsCount = () => {
    return Object.values(selectedTopics).reduce((sum, set) => sum + set.size, 0);
  };

  const getTotalSubjectsCount = () => {
    return Object.keys(selectedTopics).length;
  };

  const handleGeneratePlan = () => {
    if (!selectedExam) {
      toast({
        title: 'Select Exam',
        description: 'Please select an exam first.',
        variant: 'destructive'
      });
      return;
    }

    if (getTotalSubjectsCount() === 0) {
      toast({
        title: 'Select Subjects',
        description: 'Please select at least one subject.',
        variant: 'destructive'
      });
      return;
    }

    // Check that each selected subject has at least one topic
    const subjectsWithoutTopics = Object.entries(selectedTopics)
      .filter(([_, topics]) => topics.size === 0)
      .map(([subject]) => subject);

    if (subjectsWithoutTopics.length > 0) {
      toast({
        title: 'Select Topics',
        description: 'Each subject must have at least one topic selected.',
        variant: 'destructive'
      });
      return;
    }

    // Convert to SelectedTopic format
    const topicsArray: SelectedTopic[] = Object.entries(selectedTopics).map(([subjectName, topicIds]) => {
      const subject = subjectsWithTopics.find(s => s.name === subjectName)!;
      const selectedTopicsList = Array.from(topicIds);

      return {
        subject: subjectName,
        subjectIcon: subject.iconColor,
        topicIds: selectedTopicsList,
        topicNames: selectedTopicsList.map(id => {
          const topic = subject.topics.find(t => t.id === id);
          return topic?.name || id;
        })
      };
    });

    selectTopicsAndGeneratePlan(selectedExam, topicsArray);

    toast({
      title: 'Plan Generated! 🎯',
      description: `Your personalized journey with ${getTotalTopicsCount()} topics is ready!`,
      variant: 'default'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Select Your Weak Areas</h2>
        <p className="text-gray-600">Choose the topics you want to strengthen. We'll create a personalized plan for you.</p>
      </div>

      {/* Exam Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Select Your Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-full md:w-96">
              <SelectValue placeholder="Choose an exam..." />
            </SelectTrigger>
            <SelectContent>
              {availableExams.map(examId => {
                const exam = allSyllabusData[examId];
                return (
                  <SelectItem key={examId} value={examId}>
                    {exam.examName} - {exam.fullName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Subject & Topic Selection */}
      {selectedExam && (
        <>
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">How to Select</h3>
                  <p className="text-sm text-gray-700">
                    Choose subjects you want to improve, then select specific weak topics within each subject.
                    Each day, you'll study one topic from each selected subject.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Step 2: Select Topics</h3>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-sm">
                  {getTotalSubjectsCount()} Subjects
                </Badge>
                <Badge variant="default" className="text-sm bg-blue-600">
                  {getTotalTopicsCount()} Topics
                </Badge>
              </div>
            </div>

            {subjectsWithTopics.map((subject) => {
              const isExpanded = expandedSubjects.has(subject.name);
              const selectedCount = getSelectedCount(subject.name);
              const Icon = subject.icon;

              return (
                <Card
                  key={subject.name}
                  className={`border-2 transition-all ${selectedCount > 0 ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
                >
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSubject(subject.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${subject.iconColor}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{subject.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {subject.topics.length} topics available
                            {selectedCount > 0 && ` • ${selectedCount} selected`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedCount > 0 && (
                          <Badge className="bg-blue-600">
                            {selectedCount}
                          </Badge>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="pt-0">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {subject.topics.map((topic) => {
                          const isSelected = selectedTopics[subject.name]?.has(topic.id) || false;

                          return (
                            <div
                              key={topic.id}
                              className={`flex items-start gap-2 p-3 rounded-lg border-2 transition-all cursor-pointer hover:bg-gray-50 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                              onClick={() => toggleTopic(subject.name, topic.id)}
                            >
                              <Checkbox
                                id={`${subject.name}-${topic.id}`}
                                checked={isSelected}
                                onCheckedChange={() => toggleTopic(subject.name, topic.id)}
                                className="mt-0.5"
                              />
                              <Label
                                htmlFor={`${subject.name}-${topic.id}`}
                                className="text-sm cursor-pointer leading-tight"
                              >
                                {topic.name}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Generate Button */}
      {selectedExam && getTotalTopicsCount() > 0 && (
        <div className="flex flex-col items-center gap-4 pt-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              Your plan will have <span className="font-semibold text-blue-600">{getTotalTopicsCount()} chapters</span> across{' '}
              <span className="font-semibold text-blue-600">{getTotalSubjectsCount()} subjects</span>
            </div>
            <div className="text-xs text-gray-500">
              Each chapter has 35 resources (5 videos, 20 tests, 10 PDFs)
            </div>
          </div>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12"
            onClick={handleGeneratePlan}
          >
            Generate My Learning Plan
          </Button>
        </div>
      )}
    </div>
  );
};

// Helper function to get subject icon
function getSubjectIcon(subjectName: string) {
  const name = subjectName.toLowerCase();
  if (name.includes('quant') || name.includes('numerical') || name.includes('data')) return Calculator;
  if (name.includes('reasoning') || name.includes('logic')) return Brain;
  if (name.includes('english') || name.includes('language')) return BookOpen;
  if (name.includes('awareness') || name.includes('general') || name.includes('gk')) return Globe;
  return BookOpen;
}

export default SubjectSelection;
