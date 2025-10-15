import React from 'react';
import { useProfileSelectors } from '../store/profileStore';
import { User, Pill, TrendingUp } from 'lucide-react';

/**
 * Example component demonstrating how to use Zustand state management
 * This component shows how to access profile data using selectors
 */
export const ProfileSummary: React.FC = () => {
    const {
        profileExists,
        profileDisplayName,
        medicationCount,
    } = useProfileSelectors();

    if (!profileExists) {
        return (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No profile found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <User className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-semibold text-gray-900">{profileDisplayName}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Pill className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{medicationCount}</p>
                    <p className="text-sm text-gray-600">Medications</p>
                </div>

                
            </div>
        </div>
    );
};
