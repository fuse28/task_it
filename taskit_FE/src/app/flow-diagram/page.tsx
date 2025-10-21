'use client'

import MainLayout from '../../components/MainLayout'

export default function FlowDiagramPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flow Diagram</h1>
            <p className="text-gray-600 mt-1">Create and manage process flow diagrams</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              New Flow
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap">
              Import
            </button>
          </div>
        </div>

        {/* Flow Diagram Canvas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96">
          <div className="p-6 h-full">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No flow diagram</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new flow diagram.</p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Create Flow Diagram
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flow Templates */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Flow Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'User Registration Flow', description: 'Complete user registration process' },
              { name: 'Order Processing Flow', description: 'E-commerce order workflow' },
              { name: 'Content Approval Flow', description: 'Content review and approval process' },
              { name: 'Bug Report Flow', description: 'Issue tracking and resolution' },
              { name: 'Feature Request Flow', description: 'New feature development process' },
              { name: 'Customer Support Flow', description: 'Customer inquiry handling' }
            ].map((template, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700">
                  Use Template →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
