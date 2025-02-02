import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  XMarkIcon,
  CalendarIcon,
  PencilSquareIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import axios from '../../api/axios';

const ApplicationDetails = ({ application, isOpen, onClose, onUpdate }) => {
  const [note, setNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const addNote = async () => {
    if (!note.trim()) return;

    try {
      await axios.post(`/api/jobstract/applications/${application.id}/add_event/`, {
        event_type: 'note_added',
        description: note,
      });
      setNote('');
      onUpdate();
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const scheduleFollowUp = async () => {
    if (!followUpDate) return;

    try {
      await axios.post(`/api/jobstract/applications/${application.id}/add_event/`, {
        event_type: 'follow_up',
        description: `Follow-up scheduled for ${followUpDate}`,
      });

      // Update the application's next_follow_up date
      await axios.patch(`/api/jobstract/applications/${application.id}/`, {
        next_follow_up: followUpDate,
      });

      setFollowUpDate('');
      onUpdate();
    } catch (err) {
      console.error('Error scheduling follow-up:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!application) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-black px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                      Application Details
                    </Dialog.Title>

                    {/* Job Information */}
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {application.opportunity.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {application.opportunity.employer.employer_name} • {application.opportunity.location}
                      </p>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Applied on {formatDate(application.applied_date)}
                      </p>
                    </div>

                    {/* Add Note */}
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Add Note
                      </h4>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-black/80"
                        rows={3}
                        placeholder="Add a note about this application..."
                      />
                      <button
                        onClick={addNote}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <ChatBubbleLeftEllipsisIcon className="h-4 w-4 mr-1" />
                        Add Note
                      </button>
                    </div>

                    {/* Schedule Follow-up */}
                    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Schedule Follow-up
                      </h4>
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-black/80"
                      />
                      <button
                        onClick={scheduleFollowUp}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Schedule Follow-up
                      </button>
                    </div>

                    {/* Cover Letter */}
                    {application.cover_letter && (
                      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          Cover Letter
                        </h4>
                        <div className="prose prose-sm max-w-none text-gray-500 dark:text-gray-400">
                          {application.cover_letter}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ApplicationDetails;
