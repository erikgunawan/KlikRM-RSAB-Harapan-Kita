import { Dialog, Transition } from '@headlessui/react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Fragment } from 'react';
import { clsx } from 'clsx';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
};

const colors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
};

export function Alert({ isOpen, onClose, title, message, type }: AlertProps) {
  const Icon = icons[type];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <Icon className={clsx('h-6 w-6', colors[type])} />
                <Dialog.Title className="text-lg font-medium">{title}</Dialog.Title>
              </div>

              <p className="mt-4 text-sm text-gray-600">{message}</p>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onClose}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}