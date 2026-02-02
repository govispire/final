import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Trophy, Video } from 'lucide-react';

const PeerStudy = () => {
  const studyGroups = [
    { id: 1, name: 'Quant Squad', members: 24, topic: 'Quantitative Aptitude', active: true },
    { id: 2, name: 'Reasoning Warriors', members: 18, topic: 'Logical Reasoning', active: true },
    { id: 3, name: 'English Masters', members: 31, topic: 'English Grammar', active: false },
    { id: 4, name: 'GA Champions', members: 15, topic: 'General Awareness', active: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Peer Study Sessions</h2>
              <p className="text-blue-100">Learn together, grow together</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Active Study Groups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {studyGroups.map((group) => (
            <div 
              key={group.id}
              className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{group.name}</h4>
                    <p className="text-sm text-gray-600">{group.topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{group.members} members</span>
                      {group.active && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Live Now
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant={group.active ? 'default' : 'outline'}>
                  {group.active ? 'Join Session' : 'Join Group'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Discussion Forum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Ask doubts, share strategies, and help each other
            </p>
            <Button className="w-full" variant="outline">
              Open Forum
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Group Mock Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Take tests together and compete with peers
            </p>
            <Button className="w-full" variant="outline">
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Group Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { time: 'Today, 6:00 PM', topic: 'Speed Math Tricks', host: 'Rajesh Kumar' },
            { time: 'Tomorrow, 5:00 PM', topic: 'Puzzle Solving Strategies', host: 'Priya Sharma' },
            { time: 'Wed, 7:00 PM', topic: 'Reading Comprehension Tips', host: 'Amit Patel' },
          ].map((session, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200"
            >
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{session.topic}</p>
                  <p className="text-xs text-gray-600">by {session.host}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.time}</p>
                <Button size="sm" variant="ghost" className="text-xs">
                  Set Reminder
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PeerStudy;
