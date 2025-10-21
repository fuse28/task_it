'use client'

import MainLayout from '../../components/MainLayout'

export default function DrawingBoardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Drawing Board</h1>
            <p className="text-gray-600 mt-1">Create sketches, wireframes, and visual designs</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
              New Drawing
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap">
              Upload Image
            </button>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-96">
          <div className="p-6 h-full">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No drawing board</h3>
                <p className="mt-1 text-sm text-gray-500">Start creating by opening a new drawing board.</p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Create Drawing Board
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawing Tools */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Drawing Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Pen Tool', icon: '✏️', description: 'Freehand drawing' },
              { name: 'Shape Tool', icon: '🔷', description: 'Geometric shapes' },
              { name: 'Text Tool', icon: '📝', description: 'Add text annotations' },
              { name: 'Eraser', icon: '🧽', description: 'Remove elements' },
              { name: 'Color Picker', icon: '🎨', description: 'Select colors' },
              { name: 'Layers', icon: '📚', description: 'Manage layers' }
            ].map((tool, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer text-center">
                <div className="text-2xl mb-2">{tool.icon}</div>
                <h4 className="font-medium text-gray-900 text-sm">{tool.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Drawings */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Drawings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'UI Wireframe v1', date: '2 hours ago', thumbnail: '📐' },
              { name: 'User Flow Sketch', date: '1 day ago', thumbnail: '🔄' },
              { name: 'Logo Concepts', date: '3 days ago', thumbnail: '🎨' },
              { name: 'Dashboard Layout', date: '1 week ago', thumbnail: '📊' },
              { name: 'Mobile App Design', date: '2 weeks ago', thumbnail: '📱' },
              { name: 'Website Mockup', date: '3 weeks ago', thumbnail: '🌐' }
            ].map((drawing, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{drawing.thumbnail}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{drawing.name}</h4>
                    <p className="text-sm text-gray-600">{drawing.date}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
