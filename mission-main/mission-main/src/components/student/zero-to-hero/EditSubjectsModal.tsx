import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { AlertTriangle } from 'lucide-react';
import SubjectSelection from './SubjectSelection';

interface EditSubjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditSubjectsModal: React.FC<EditSubjectsModalProps> = ({ isOpen, onClose }) => {
    const { resetJourney } = useZeroToHero();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleReset = () => {
        resetJourney();
        setShowConfirm(false);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen && !showConfirm} onOpenChange={onClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Your Learning Plan</DialogTitle>
                    </DialogHeader>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-1">Warning: This will reset your current progress</p>
                                <p>Changing your topics will create a completely new learning plan and reset your current progress.</p>
                            </div>
                        </div>
                    </div>

                    <SubjectSelection />

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setShowConfirm(true)}
                        >
                            Reset & Change Topics
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Reset</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <p className="text-gray-700">
                            Are you sure you want to reset your journey? This action cannot be undone.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Your XP and level will be preserved, but all topic progress will be lost.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReset}>
                            Yes, Reset Journey
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditSubjectsModal;
