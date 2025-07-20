'use client';

export default function ContactForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`mb-8 bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${open ? 'opacity-100 max-h-[1500px] border border-gray-200' : 'opacity-0 max-h-0 overflow-hidden border-0'}`}
    >
      <div className='bg-teal-800 text-white px-6 py-4 flex justify-between items-center'>
        <h2 className='text-xl font-medium flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-2'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
          </svg>
          Add New Contact
        </h2>
        <button
          type='button'
          onClick={onClose}
          className='text-white hover:text-gray-200 rounded-full p-1 hover:bg-teal-700 transition-colors'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
      <div className='p-6'>
        {/* Profile Image Upload */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Profile Photo</label>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <label htmlFor='first_name' className='block text-sm font-medium text-gray-700'>
              First Name
            </label>
            <input
              id='first_name'
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='space-y-1'>
            <label htmlFor='last_name' className='block text-sm font-medium text-gray-700'>
              Last Name
            </label>
            <input
              id='last_name'
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='space-y-1'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              id='email'
              type='email'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='space-y-1'>
            <label htmlFor='last_contacted_at' className='block text-sm font-medium text-gray-700'>
              Last Contacted At
            </label>
            <input
              id='last_contacted_at'
              type='datetime-local'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='space-y-1'>
            <label htmlFor='company_name' className='block text-sm font-medium text-gray-700'>
              Company
            </label>
            <input
              id='company_name'
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          <div className='space-y-1'>
            <label htmlFor='job_title' className='block text-sm font-medium text-gray-700'>
              Job Title
            </label>
            <input
              id='job_title'
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>

          {/* Removed URL input - using only file upload now */}

          <div className='space-y-1'>
            <label htmlFor='source' className='block text-sm font-medium text-gray-700'>
              Source
            </label>
            <input
              id='source'
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        <div className='space-y-1 mt-4'>
          <label htmlFor='notes' className='block text-sm font-medium text-gray-700'>
            Notes
          </label>
          <textarea
            id='notes'
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
      </div>
    </div>
  );
}
