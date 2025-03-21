'use client';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';

export default function PDFManager() {
  const [showModal, setShowModal] = useState(false);
  const [pdfs, setPdfs] = useState([
    {
      title: 'Sample PDF 1',
      subject: 'Math',
      description: 'Sample description for Math PDF',
      link: '#',
    },
    {
      title: 'Sample PDF 2',
      subject: 'Science',
      description: 'Sample description for Science PDF',
      link: '#',
    },
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    subject: '',
    description: '',
    file: '',
  });

  const onDrop = (acceptedFiles : any) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setFormErrors({ ...formErrors, file: '' }); // Clear file error when file is selected
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'application/pdf',
    onDrop,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!selectedFile) errors.file = 'PDF file is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      // Submit the form if no errors
      const newPdf = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        link: URL.createObjectURL(selectedFile), // Use blob URL for local display
      };
      setPdfs([...pdfs, newPdf]);
      setShowModal(false); // Close the modal after saving
      setFormData({ title: '', subject: '', description: '' });
      setSelectedFile(null); // Clear selected file
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col items-center p-8 ${showModal ? 'backdrop-blur-sm' : ''}`}>
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#1E3F66]">PDF Manager</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1E3F66] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#162D4E]"
          >
            <FaPlus /> Add New PDF
          </button>
        </div>
        <p className="text-gray-600 mt-1">Store, organize, and manage your PDF documents in one place</p>

        <div className="mt-4 border rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Description</th>
                <th className="p-3">PDF</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pdfs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <span className="text-5xl">📄</span>
                      <p className="mt-2">No PDFs found</p>
                      <p className="text-gray-400">Add your first PDF</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pdfs.map((pdf, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3 text-black">{pdf.title}</td>
                    <td className="p-3 text-black">{pdf.subject}</td>
                    <td className="p-3 text-black">{pdf.description}</td>
                    <td className="p-3 text-black">
                      <a
                        href={pdf.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View PDF
                      </a>
                    </td>
                    <td className="p-3 text-black">Actions</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-[#1E3F66]">Add New PDF</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md text-black"
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md text-black"
                />
                {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md text-black"
                />
                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
              </div>

              {/* PDF Upload Section */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Upload PDF</label>
                <div
                  {...getRootProps()}
                  className="w-full p-4 border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                >
                  <input {...getInputProps()} />
                  {selectedFile ? (
                    <p className="text-gray-700">{selectedFile.name}</p>
                  ) : (
                    <p className="text-gray-500">Drag & drop a PDF here, or click to browse</p>
                  )}
                </div>
                {formErrors.file && <p className="text-red-500 text-xs mt-1">{formErrors.file}</p>}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E3F66] text-white rounded-md hover:bg-[#162D4E]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
