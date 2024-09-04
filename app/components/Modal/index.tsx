import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '~/components/Button';
import { CrossIcon } from '~/icons/CrossIcon';

type ModalType = {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalType) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        onClose={() => onClose(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 w-screen overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 sm:ml-64">
            <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white p-4">
              <Dialog.Title className={'flex justify-end'}>
                <Button
                  tone={'none'}
                  icon={<CrossIcon />}
                  onClick={() => onClose(false)}
                />
              </Dialog.Title>
              <Dialog.Description className={'p-2'} as={'div'}>
                {children}
              </Dialog.Description>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
