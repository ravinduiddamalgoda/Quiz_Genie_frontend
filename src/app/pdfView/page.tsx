'use client';
import { useEffect, useState } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrashAlt, FaFilePdf, FaDownload } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import axios from 'axios';
// Import jsPDF correctly
import { jsPDF } from 'jspdf';
// Import autoTable and apply it correctly
import 'jspdf-autotable';
import { useAuthStore } from '@/store/useStore';


// Define TypeScript interfaces
interface PDFDocument {
  _id: string;
  title: string;
  subject: string;
  description: string;
  key: string;
  downloadUrl?: string;
}

interface FormDataInterface {
  title: string;
  subject: string;
  description: string;
}

interface FormErrorsInterface {
  title: string;
  subject: string;
  description: string;
  file: string;
}

export default function PDFManager() {
  const [title, setTitle] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [allImage, setAllImage] = useState<PDFDocument[]>([]);  // fetch
  
  const token = useAuthStore((state) => state.token);
  // Fetch the PDFs from the backend
  useEffect(() => {
    getPdf();
  }, []);
  
  const getPdf = async (): Promise<void> => {
    try {
      const result = await axios.get("http://localhost:3600/api/files/get-files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched data:", result.data.data);
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  
  // Stores the selected PDF file.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  //Holds user input
  const [formData, setFormData] = useState<FormDataInterface>({
    title: '',
    subject: '',
    description: '',
  });

  // Stores validation errors.
  const [formErrors, setFormErrors] = useState<FormErrorsInterface>({
    title: '',
    subject: '',
    description: '',
    file: '',
  });
  
  const [editIndex, setEditIndex] = useState<number | null>(null); // Index of PDF to edit
  const [editId, setEditId] = useState<string | null>(null); // ID of PDF to edit
  const [fullDescription, setFullDescription] = useState<PDFDocument | null>(null); // State for full description modal

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes

  const onDrop = (acceptedFiles: File[]): void => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFormErrors({ ...formErrors, file: 'File size exceeds 20MB limit' });
        return;
      }
      
      setSelectedFile(file);
      setFormErrors({ ...formErrors, file: '' }); // Clear file error when valid file is selected
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {'application/pdf': ['.pdf']},
    onDrop,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    // Update formData
    setFormData({ ...formData, [name]: value });
  
    // Also update individual states
    if (name === "title") setTitle(value);
    else if (name === "subject") setSubject(value);
    else if (name === "description") setDescription(value);
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
  
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
  
    if (!formData.subject.trim()) {
      errors.subject = "Subject is required";
    }
  
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
  
    if (!selectedFile) {
      errors.file = "File is required";
    }
  
    return errors;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    const errors = validateForm();
    setFormErrors(errors as FormErrorsInterface);
  
    if (Object.keys(errors).length === 0) {
      console.log("Preparing FormData for submission...");
  
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subject", formData.subject);
      data.append("description", formData.description);
      if (selectedFile) {
        data.append("selectedFile", selectedFile);
      }
      
      try {
        const response = await axios.post("http://localhost:3600/api/files/upload-file", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      
        if (response.status === 200) {
          console.log("Upload Success ✅", response.data);
          
          // Reset form and close modal
          setFormData({ title: '', subject: '', description: '' });
          setSelectedFile(null);
          setShowModal(false);
          
          // Refresh the PDF list
          getPdf();
        
          Swal.fire({
            icon: 'success',
            title: 'PDF Uploaded!',
            text: 'Your PDF was successfully submitted.',
          });
        }
        else {
          throw new Error("Unexpected response");
        }
      } catch (error) {
        console.error("Upload Failed ❌", error);
      
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Please try again.',
        });
      }
    } else {
      console.warn("Validation Errors ⚠️", errors);
    }
  };
  
  // Modified handleView function to fetch the download URL and open it in a new tab
  const handleView = async (id: string): Promise<void> => {
    try {
      const response = await axios.get(`http://localhost:3600/api/files/download/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.status === "success" && response.data.data.downloadUrl) {
        window.open(response.data.data.downloadUrl, '_blank', 'noreferrer');
      } else {
        throw new Error("Failed to get download URL");
      }
    } catch (error) {
      console.error("Error fetching download URL:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to open PDF. Please try again.',
      });
    }
  };

  const handleEdit = (pdf: PDFDocument, index: number): void => {
    // Pre-fill the form with the current PDF data for editing
    setFormData({
      title: pdf.title,
      subject: pdf.subject,
      description: pdf.description,
    });
    setTitle(pdf.title);
    setSubject(pdf.subject);
    setDescription(pdf.description);
    setEditIndex(index); // Store the index of the PDF to edit
    setEditId(pdf._id); // Store the ID of the PDF to edit
    setShowEditModal(true); // Show the Edit Modal
  };

  const handleDelete = (id: string): void => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This PDF will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Fixed the delete endpoint URL
          await axios.delete(`http://localhost:3600/api/files/delete-file/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // After successful deletion, refresh the PDF list
          getPdf();
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your PDF has been deleted.',
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete the PDF. Please try again.',
          });
          console.error('Delete error:', error);
        }
      }
    });
  };
  
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Create a new errors object with file validation removed for edit mode
    const baseErrors = {
      title: formData.title ? '' : 'Title is required',
      subject: formData.subject ? '' : 'Subject is required',
      description: formData.description ? '' : 'Description is required',
      file: '' // File is optional for edit
    };
    
    setFormErrors(baseErrors);
    
    // Check if there are any validation errors
    const hasErrors = Object.values(baseErrors).some(error => error !== '');
    
    if (!hasErrors && editId) {
      try {
        console.log("Preparing update for PDF with ID:", editId);
        
        // Create FormData for the update
        const data = new FormData();
        data.append("title", formData.title);
        data.append("subject", formData.subject);
        data.append("description", formData.description);
        
        // Only append file if a new file was selected
        if (selectedFile) {
          data.append("selectedFile", selectedFile);
        }
        
        // Send update request to backend with proper URL and headers
        const response = await axios.put(`http://localhost:3600/api/files/update-file/${editId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Update response:", response);
        
        if (response.status === 200) {
          // Refresh the PDF list
          getPdf();
          
          // Reset state and close modal
          setShowEditModal(false);
          setFormData({ title: '', subject: '', description: '' });
          setTitle('');
          setSubject('');
          setDescription('');
          setSelectedFile(null);
          setEditId(null);
          setEditIndex(null);
          
          Swal.fire({
            icon: 'success',
            title: 'PDF Updated',
            text: 'Your PDF has been updated successfully!',
          });
        }
      } catch (error) {
        console.error("Update Failed ❌", error);
        
        // Show more detailed error information
        const errorMessage = error.response?.data?.message || 'Please try again.';
        
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: errorMessage,
        });
      }
    } else if (!editId) {
      console.error("Edit ID is missing");
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'PDF reference is missing. Please try again.',
      });
    }
  };

  const handleCloseEditModal = (): void => {
    setShowEditModal(false);
    setFormData({ title: '', subject: '', description: '' }); // Clear form data when closing the modal
    setTitle('');
    setSubject('');
    setDescription('');
    setSelectedFile(null); // Clear selected file
    setEditId(null);
    setEditIndex(null);
  };

  const handleViewFullDescription = (pdf: PDFDocument): void => {
    setFullDescription(pdf);
  };

  const handleCloseFullDescription = (): void => {
    setFullDescription(null);
  };

  const truncateDescription = (description: string): string => {
    const words = description.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    }
    return description;
  };

  const getDateFromObjectId = (objectId: string): string => {
    return new Date(parseInt(objectId.substring(0, 8), 16) * 1000).toLocaleDateString();
  };

  // Fixed function to generate and download a PDF with table data
  const handleDownloadTableData = (): void => {
    try {
      // Create a new jsPDF document
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: 'PDF Manager - Document List',
        author: 'PDF Manager',
        creator: 'PDF Manager Application'
      });
      
      // Add title to the PDF
      doc.setFontSize(18);
      doc.setTextColor(30, 63, 102); // #1E3F66
      doc.text('PDF Manager - Document List', 14, 20);
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 26);
      
      // Create table data with all columns except Actions
      const tableColumn = ["Title", "Subject", "Description", "Date Added"];
      
      // Map the data from allImage state to table rows
      const tableRows = allImage.map((pdf) => [
        pdf.title,
        pdf.subject,
        // Truncate description for better fit in PDF
        pdf.description.length > 60 ? 
          pdf.description.substring(0, 60) + '...' : 
          pdf.description,
        getDateFromObjectId(pdf._id)
      ]);
      
      // Import autoTable dynamically to ensure it's registered
      import('jspdf-autotable').then((autoTableModule) => {
        // Use the autoTable function
        autoTableModule.default(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 35,
          theme: 'striped',
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [30, 63, 102], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          margin: { top: 35 }
        });
        
        // Save the PDF - this triggers the download
        doc.save('pdf-manager-documents.pdf');
        
        // Show success notification
        Swal.fire({
          icon: 'success',
          title: 'PDF Downloaded',
          text: 'Your document list has been downloaded as a PDF.',
          timer: 2000,
          showConfirmButton: false
        });
      }).catch((error) => {
        console.error("Error loading autoTable:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to generate PDF. Please try again.',
        });
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to generate PDF. Please try again.',
      });
    }
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
              {allImage.length === 0 ? (
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
                allImage.map((pdf: PDFDocument, index: number) => (
                  <tr key={pdf._id} className="border-t">
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
                    <td className="p-3 text-black">{getDateFromObjectId(pdf._id)}</td>
                    <td className="p-3 text-black flex gap-2 items-center">
                      <FaEye
                        onClick={() => handleView(pdf._id)}
                        className="text-black cursor-pointer hover:text-gray-700"
                        title="View PDF"
                      />
                      <FaEdit
                        onClick={() => handleEdit(pdf, index)}
                        className="text-black cursor-pointer hover:text-gray-700"
                        title="Edit PDF"
                      />
                      <FaTrashAlt
                        onClick={() => handleDelete(pdf._id)}
                        className="text-red-600 cursor-pointer hover:text-red-800"
                        title="Delete PDF"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Download button - Added at the bottom of the table */}
        {allImage.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleDownloadTableData}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700"
            >
              <FaDownload /> PDF Details Report
            </button>
          </div>
        )}
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
                    <p className="text-gray-700">{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</p>
                  ) : (
                    <div>
                      <FaFilePdf className="mx-auto text-gray-500 text-3xl" />
                      <p className="text-gray-500">Drag & drop a PDF here, or click to select</p>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-1">Maximum file size: 20MB</p>
                {formErrors.file && <p className="text-red-500 text-xs mt-1">{formErrors.file}</p>}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ title: '', subject: '', description: '' });
                    setSelectedFile(null);
                    setFormErrors({ title: '', subject: '', description: '', file: '' });
                  }}
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
                <label className="block text-sm font-medium text-gray-700">Upload PDF (Optional)</label>
                <div
                  {...getRootProps()}
                  className="w-full p-4 border-dashed border-2 border-gray-300 rounded-md text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                >
                  <input {...getInputProps()} />
                  {selectedFile ? (
                    <p className="text-gray-700">{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</p>
                  ) : (
                    <div>
                      <FaFilePdf className="mx-auto text-gray-500 text-3xl" />
                      <p className="text-gray-500">Drag & drop a PDF here, or click to select</p>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-1">Maximum file size: 20MB</p>
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
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-[#1E3F66]">{fullDescription.title}</h2>
            <p className="mt-4 text-black">{fullDescription.description}</p>
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