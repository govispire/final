import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
    Video,
    FileText,
    ClipboardCheck,
    CheckCircle2,
    Circle,
    PlayCircle,
    Clock,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import { useZeroToHero, Chapter, TopicResource } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';

interface ChapterDetailProps {
    chapter: Chapter;
    dayIndex: number;
    onBack: () => void;
}

const ChapterDetail: React.FC<ChapterDetailProps> = ({ chapter, dayIndex, onBack }) => {
    const { completeResource } = useZeroToHero();
    const [activeTab, setActiveTab] = useState<'videos' | 'tests' | 'pdfs'>('videos');

    const handleResourceComplete = (resourceId: string) => {
        completeResource(dayIndex, chapter.id, resourceId);
        toast({
            title: 'Progress Updated! ✨',
            description: 'Keep going! You\'re making great progress.',
            duration: 2000
        });
    };

    const getResourceStats = () => {
        const videosCompleted = chapter.resources.videos.filter(v => v.completed).length;
        const testsCompleted = chapter.resources.tests.filter(t => t.completed).length;
        const pdfsCompleted = chapter.resources.pdfs.filter(p => p.completed).length;

        return {
            videos: { completed: videosCompleted, total: chapter.resources.videos.length },
            tests: { completed: testsCompleted, total: chapter.resources.tests.length },
            pdfs: { completed: pdfsCompleted, total: chapter.resources.pdfs.length }
        };
    };

    const stats = getResourceStats();
    const totalCompleted = stats.videos.completed + stats.tests.completed + stats.pdfs.completed;
    const totalResources = 35;

    const renderResourceList = (resources: TopicResource[], icon: React.ElementType, type: string) => {
        return (
            <div className="space-y-2">
                {resources.map((resource, index) => {
                    const Icon = icon;
                    return (
                        <div
                            key={resource.id}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${resource.completed
                                ? 'bg-green-50 border-green-300'
                                : 'bg-white border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            <Checkbox
                                id={resource.id}
                                checked={resource.completed}
                                onCheckedChange={() => !resource.completed && handleResourceComplete(resource.id)}
                                className="mt-1"
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2">
                                    <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${resource.completed ? 'text-green-600' : 'text-gray-400'
                                        }`} />
                                    <div className="flex-1">
                                        <label
                                            htmlFor={resource.id}
                                            className={`font-medium cursor-pointer ${resource.completed ? 'text-green-900 line-through' : 'text-gray-900'
                                                }`}
                                        >
                                            {resource.title}
                                        </label>
                                        {resource.duration && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{Math.floor(resource.duration)} min</span>
                                            </div>
                                        )}
                                        {resource.completed && resource.completedAt && (
                                            <div className="text-xs text-green-600 mt-1">
                                                ✓ Completed {new Date(resource.completedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!resource.completed && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-shrink-0"
                                    onClick={() => window.open(resource.url, '_blank')}
                                >
                                    {type === 'video' && <PlayCircle className="h-4 w-4 mr-1" />}
                                    {type === 'video' ? 'Watch' : type === 'test' ? 'Take Test' : 'View'}
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <div className="text-sm text-gray-600">{chapter.subject}</div>
                    <h2 className="text-2xl font-bold text-gray-900">{chapter.topicName}</h2>
                </div>
            </div>

            {/* Overall Progress */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Overall Progress</div>
                            <div className="text-3xl font-bold text-gray-900">
                                {chapter.completionPercentage}%
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Resources Completed</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {totalCompleted}/{totalResources}
                            </div>
                        </div>
                    </div>

                    <Progress value={chapter.completionPercentage} className="h-3" />

                    {chapter.completionPercentage === 100 && (
                        <div className="mt-4 flex items-center gap-2 text-green-700 bg-green-100 p-3 rounded-lg">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">Chapter Complete! Amazing work! 🎉</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resource Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className={activeTab === 'videos' ? 'border-2 border-blue-500' : ''}>
                    <CardContent className="p-4 text-center">
                        <Video className="h-6 w-6 mx-auto mb-2 text-red-600" />
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.videos.completed}/{stats.videos.total}
                        </div>
                        <div className="text-sm text-gray-600">Videos</div>
                    </CardContent>
                </Card>

                <Card className={activeTab === 'tests' ? 'border-2 border-blue-500' : ''}>
                    <CardContent className="p-4 text-center">
                        <ClipboardCheck className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.tests.completed}/{stats.tests.total}
                        </div>
                        <div className="text-sm text-gray-600">Tests</div>
                    </CardContent>
                </Card>

                <Card className={activeTab === 'pdfs' ? 'border-2 border-blue-500' : ''}>
                    <CardContent className="p-4 text-center">
                        <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.pdfs.completed}/{stats.pdfs.total}
                        </div>
                        <div className="text-sm text-gray-600">PDFs</div>
                    </CardContent>
                </Card>
            </div>

            {/* Resource Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="videos" className="relative">
                        Videos ({stats.videos.completed}/{stats.videos.total})
                        {stats.videos.completed === stats.videos.total && (
                            <CheckCircle2 className="h-4 w-4 ml-1 text-green-600" />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="tests" className="relative">
                        Tests ({stats.tests.completed}/{stats.tests.total})
                        {stats.tests.completed === stats.tests.total && (
                            <CheckCircle2 className="h-4 w-4 ml-1 text-green-600" />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="pdfs" className="relative">
                        PDFs ({stats.pdfs.completed}/{stats.pdfs.total})
                        {stats.pdfs.completed === stats.pdfs.total && (
                            <CheckCircle2 className="h-4 w-4 ml-1 text-green-600" />
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="videos" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Video Lessons</h3>
                        <Badge variant="secondary">
                            {stats.videos.completed}/{stats.videos.total} completed
                        </Badge>
                    </div>
                    {renderResourceList(chapter.resources.videos, Video, 'video')}
                </TabsContent>

                <TabsContent value="tests" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Practice Tests</h3>
                        <Badge variant="secondary">
                            {stats.tests.completed}/{stats.tests.total} completed
                        </Badge>
                    </div>
                    {renderResourceList(chapter.resources.tests, ClipboardCheck, 'test')}
                </TabsContent>

                <TabsContent value="pdfs" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Study Materials</h3>
                        <Badge variant="secondary">
                            {stats.pdfs.completed}/{stats.pdfs.total} completed
                        </Badge>
                    </div>
                    {renderResourceList(chapter.resources.pdfs, FileText, 'pdf')}
                </TabsContent>
            </Tabs>

            {/* Motivation */}
            {chapter.completionPercentage < 100 && chapter.completionPercentage > 0 && (
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            <div>
                                <div className="font-medium text-gray-900">Keep Going!</div>
                                <div className="text-sm text-gray-600">
                                    {totalCompleted} resources down, {totalResources - totalCompleted} to go!
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ChapterDetail;
