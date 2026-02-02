import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BookOpen, Brain, MessageSquare, Globe, Computer } from 'lucide-react';
import { useZeroToHero, WeakArea } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';

interface EditSubjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditSubjectsModal = ({ isOpen, onClose }: EditSubjectsModalProps) => {
    const { journeyState, updateSubjectsAndWeakAreas } = useZeroToHero();
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [weakAreas, setWeakAreas] = useState<Record<string, string[]>>({});

    // Load current state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSubjects(journeyState.selectedSubjects);
            const weakAreasMap: Record<string, string[]> = {};
            journeyState.weakAreas.forEach(area => {
                weakAreasMap[area.subject] = area.topics;
            });
            setWeakAreas(weakAreasMap);
        }
    }, [isOpen, journeyState]);

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

    const handleSave = () => {
        if (selectedSubjects.length === 0) {
            toast({
                title: 'Select Subjects',
                description: 'Please select at least one subject.',
                type: 'error'
            });
            return;
        }

        const weakAreasArray: WeakArea[] = selectedSubjects.map(subject => ({
            subject,
            topics: weakAreas[subject] || []
        }));

        updateSubjectsAndWeakAreas(selectedSubjects, weakAreasArray);

        toast({
            title: 'Pathway Updated! 🔄',
            description: 'Your future tasks have been regenerated based on your new goals.',
            type: 'success'
        });

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Your Weak Areas</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {subjects.map((subject) => {
                        const isSelected = selectedSubjects.includes(subject.name);
                        const SubjectIcon = subject.icon;

                        return (
                            <Card key={subject.name} className={`border-2 transition-all ${isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}>
                                <CardHeader className="py-3">
                                    <div className="flex items-center gap-4">
                                        <Checkbox
                                            id={`edit-${subject.name}`}
                                            checked={isSelected}
                                            onCheckedChange={() => toggleSubject(subject.name)}
                                        />
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${subject.color}`}>
                                            <SubjectIcon className="h-5 w-5" />
                                        </div>
                                        <Label htmlFor={`edit-${subject.name}`} className="text-lg font-semibold cursor-pointer">
                                            {subject.name}
                                        </Label>
                                    </div>
                                </CardHeader>

                                {isSelected && (
                                    <CardContent className="pb-3 pt-0">
                                        <div className="pl-14 space-y-2">
                                            <div className="grid md:grid-cols-2 gap-2">
                                                {subject.topics.map((topic) => (
                                                    <div key={topic} className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={`edit-${subject.name}-${topic}`}
                                                            checked={weakAreas[subject.name]?.includes(topic) || false}
                                                            onCheckedChange={() => toggleWeakTopic(subject.name, topic)}
                                                        />
                                                        <Label
                                                            htmlFor={`edit-${subject.name}-${topic}`}
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

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditSubjectsModal;
