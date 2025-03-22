'use client';
import { useState } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrashAlt, FaFilePdf } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';

export default function PDFManager() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pdfs, setPdfs] = useState([
    {
      title: 'Sample PDF 1',
      subject: 'Math',
      description: 'Sample description for Math PDF. This is a longer description to demonstrate truncation. More content here...',
      link: '#',
      dateAdded: new Date().toLocaleDateString(),
    },
    {
      title: 'Sample PDF 2',
      subject: 'Science',
      description: 'Sample description for Science PDF. This is another description that will be truncated for preview.',
      link: '#',
      dateAdded: new Date().toLocaleDateString(),
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
  const [editIndex, setEditIndex] = useState(null); // Index of PDF to edit
  const [fullDescription, setFullDescription] = useState(null); // State for full description modal

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

  const handleInputChange = (e:any) => {
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
        link: URL.createObjectURL(selectedFile), 
        dateAdded: new Date().toLocaleDateString(),
      };
      setPdfs([...pdfs, newPdf]);
      setShowModal(false); // Close the modal after saving
      setFormData({ title: '', subject: '', description: '' });
      setSelectedFile(null); // Clear selected file

      // Show success toast
      Swal.fire({
        icon: 'success',
        title: 'PDF Added',
        text: 'Your PDF has been added successfully!',
      });
    }
  };

  const handleView = (pdf) => {
    // Open the PDF in a new tab
    window.open(pdf.link, '_blank');
  };

  const handleEdit = (index) => {
    // Pre-fill the form with the current PDF data for editing
    setFormData({
      title: pdfs[index].title,
      subject: pdfs[index].subject,
      description: pdfs[index].description,
    });
    setEditIndex(index); // Store the index of the PDF to edit
    setShowEditModal(true); // Show the Edit Modal
  };

  const handleDelete = (index) => {
    // Show confirmation alert before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'This PDF will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if the user confirms
        setPdfs(pdfs.filter((_, i) => i !== index));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your PDF has been deleted.',
        });
      }
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const updatedPdfs = [...pdfs];
      updatedPdfs[editIndex] = {
        ...updatedPdfs[editIndex],
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        link: URL.createObjectURL(selectedFile),
      };
      setPdfs(updatedPdfs);
      setShowEditModal(false); // Close the edit modal after saving
      setFormData({ title: '', subject: '', description: '' });
      setSelectedFile(null); // Clear selected file

      // Show success toast
      Swal.fire({
        icon: 'success',
        title: 'PDF Updated',
        text: 'Your PDF has been updated successfully!',
      });
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormData({ title: '', subject: '', description: '' }); // Clear form data when closing the modal
    setSelectedFile(null); // Clear selected file
  };

  const handleViewFullDescription = (pdf) => {
    setFullDescription(pdf);
  };

  const handleCloseFullDescription = () => {
    setFullDescription(null);
  };

  const truncateDescription = (description) => {
    const words = description.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    }
    return description;
  };

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col items-center p-8 ${showModal || showEditModal ? 'backdrop-blur-sm' : ''}`}>
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
                <th className="p-3">Date Added</th>
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
                    <td className="p-3 text-black">
                      {truncateDescription(pdf.description)}
                      <button
                        onClick={() => handleViewFullDescription(pdf)}
                        className="text-blue-600 ml-2 hover:underline"
                      >
                        See more
                      </button>
                    </td>
                    <td className="p-3 text-black">{pdf.dateAdded}</td>
                    <td className="p-3 text-black flex gap-2 items-center">
                      <FaEye
                        onClick={() => handleView(pdf)}
                        className="text-black cursor-pointer hover:text-gray-700"
                      />
                      <FaEdit
                        onClick={() => handleEdit(index)}
                        className="text-black cursor-pointer hover:text-gray-700"
                      />
                      <FaTrashAlt
                        onClick={() => handleDelete(index)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
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
                    <div>
                      <FaFilePdf className="mx-auto text-gray-500 text-3xl" />
                      <p className="text-gray-500">Drag & drop a PDF here, or click to select</p>
                    </div>
                  )}
                </div>
                {formErrors.file && <p className="text-red-500 text-xs mt-1">{formErrors.file}</p>}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3F66] text-white py-2 px-4 rounded-md hover:bg-[#162D4E]"
                >
                  Save PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-[#1E3F66]">Edit PDF</h2>

            <form onSubmit={handleEditSubmit}>
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
                    <div>
                      <FaFilePdf className="mx-auto text-gray-500 text-3xl" />
                      <p className="text-gray-500">Drag & drop a PDF here, or click to select</p>
                    </div>
                  )}
                </div>
                {formErrors.file && <p className="text-red-500 text-xs mt-1">{formErrors.file}</p>}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E3F66] text-white py-2 px-4 rounded-md hover:bg-[#162D4E]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Description Modal */}
      {fullDescription && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-[#1E3F66]">{fullDescription.title}</h2>
            <p className="mt-4">{fullDescription.description}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseFullDescription}
                className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
