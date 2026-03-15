import React, { useState, useRef } from 'react'
import { UploadCloud, File as FileIcon, X } from 'lucide-react'

export function FileUpload({
  onFileSelect,
  accept = 'image/*',
  maxSize = 10,
}) {

  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)

  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateAndSelectFile = (file) => {
    setError(null)

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0])
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setError(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
            ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'}
            ${error ? 'border-rose-500 bg-rose-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">

            <div
              className={`p-4 rounded-full ${
                isDragging
                  ? 'bg-teal-100 text-teal-600'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <UploadCloud className="h-8 w-8" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900">
                Click to upload or drag and drop
              </p>

              <p className="text-xs text-slate-500 mt-1">
                DICOM, NIfTI, PNG, or JPG (max. {maxSize}MB)
              </p>
            </div>

          </div>
        </div>

      ) : (

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white">

          <div className="flex items-center space-x-4">

            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <FileIcon className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900 truncate max-w-50 sm:max-w-xs">
                {selectedFile.name}
              </p>

              <p className="text-xs text-slate-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              clearFile()
            }}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

      )}

      {error && (
        <p className="mt-2 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  )
}