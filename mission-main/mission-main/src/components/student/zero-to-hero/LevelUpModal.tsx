import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Sparkles, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    level: number;
    xp: number;
}

const LevelUpModal = ({ isOpen, onClose, level, xp }: LevelUpModalProps) => {
    useEffect(() => {
        if (isOpen) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            };

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md text-center border-none shadow-none bg-transparent p-0 overflow-hidden">
                <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 rounded-2xl border-2 border-yellow-500/50 shadow-2xl relative overflow-hidden">

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/20 blur-3xl rounded-full" />

                    {/* Level Badge */}
                    <div className="relative z-10 mx-auto w-32 h-32 mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-75 blur-md" />
                        <div className="relative bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full w-full h-full flex items-center justify-center border-4 border-yellow-100 shadow-xl">
                            <div className="text-6xl font-black text-white drop-shadow-md">{level}</div>
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold border-2 border-blue-400 whitespace-nowrap shadow-lg">
                            LEVEL UP!
                        </div>
                    </div>

                    <h2 className="relative z-10 text-3xl font-bold text-white mb-2">Spectacular!</h2>
                    <p className="relative z-10 text-blue-200 mb-6">
                        You've reached Level {level}. Your potential is unlocking!
                    </p>

                    <div className="relative z-10 grid grid-cols-2 gap-3 mb-8">
                        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                            <div className="text-white font-bold">{xp}</div>
                            <div className="text-[10px] text-slate-400 uppercase">Total XP</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                            <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                            <div className="text-white font-bold">New</div>
                            <div className="text-[10px] text-slate-400 uppercase">Badge Unlocked</div>
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col gap-3">
                        <Button
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold py-6 text-lg shadow-lg hover:shadow-orange-500/25 border-t border-white/20"
                            onClick={onClose}
                        >
                            Continue Journey
                        </Button>
                        <Button variant="ghost" className="w-full text-slate-400 hover:text-white">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Achievement
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LevelUpModal;
