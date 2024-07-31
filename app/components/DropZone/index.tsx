import React, { useEffect, useState } from 'react';
import { Button } from '~/components/Button';
import { CrossIcon } from '~/icons/CrossIcon';

type DropZoneType = {
  name: string;
  label: string;
  htmlFor: string;
  media?: string | null;
};

export function DropZone({ name, label, htmlFor, media = null }: DropZoneType) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const target = e.target.files[0];
      setSelectedFile(target);
      // onChange(target);

      // const src = URL.createObjectURL(target);
      // console.log('src', src);
      // setSelectedImage(src);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setSelectedImage(null);
  };

  useEffect(() => {
    setSelectedImage(media);
  }, [media]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium leading-8 text-gray-900">
        {label}
      </label>

      <label
        htmlFor={htmlFor}
        className={`flex justify-center ${!selectedFile && 'w-full'} h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
      >
        {!selectedImage && (
          <>
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="font-medium text-gray-600">
                Drop files to Attach, or
                <span className="text-blue-600 underline">browse</span>
              </span>
            </span>
            <input
              type="file"
              name={name}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              id={htmlFor}
            />
          </>
        )}

        {selectedImage && (
          <div className="mt-4 flex justify-between">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-56 max-h-24 rounded-md"
            />
            <Button tone={'none'} icon={<CrossIcon />} onClick={handleRemove} />
          </div>
        )}
      </label>
    </div>
  );
}
