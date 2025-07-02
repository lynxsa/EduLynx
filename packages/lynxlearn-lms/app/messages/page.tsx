'use client';

import { useState } from 'react';

// Mock users data
const users = [
  {
    id: 1,
    name: 'Mr. N. Mbatha',
    role: 'Mathematics Teacher',
    avatar: '/avatar.png',
    online: true,
    unread: 2,
    lastMessage: "I've reviewed your latest assignment and...",
    lastMessageTime: '10:25 AM',
  },
  {
    id: 2,
    name: 'Mrs. T. Naidoo',
    role: 'Science Teacher',
    avatar: '/avatar.png',
    online: false,
    unread: 0,
    lastMessage: 'Please remember to bring your lab report tomorrow',
    lastMessageTime: 'Yesterday',
  },
  {
    id: 3,
    name: 'Ms. A. van Wyk',
    role: 'English Teacher',
    avatar: '/avatar.png',
    online: true,
    unread: 1,
    lastMessage: 'Great progress on your essay!',
    lastMessageTime: 'Yesterday',
  },
  {
    id: 4,
    name: 'Study Group - Mathematics',
    role: '5 members',
    avatar: '/avatar.png',
    online: false,
    unread: 0,
    lastMessage: 'Sipho: Can anyone explain question 5?',
    lastMessageTime: 'June 20',
  },
  {
    id: 5,
    name: 'Mr. S. Mokoena',
    role: 'History Teacher',
    avatar: '/avatar.png',
    online: false,
    unread: 0,
    lastMessage: 'Your presentation date is confirmed for next week',
    lastMessageTime: 'June 18',
  },
];

// Mock conversation data
const mockConversation = [
  {
    id: 1,
    sender: 1,
    text: 'Hello Thabo, I noticed you had some difficulty with the quadratic equations in the last homework.',
    time: 'Yesterday, 3:45 PM',
    isUser: false,
  },
  {
    id: 2,
    sender: 'user',
    text: 'Yes, Mr. Mbatha. I was confused about when to use the quadratic formula versus completing the square.',
    time: 'Yesterday, 4:02 PM',
    isUser: true,
  },
  {
    id: 3,
    sender: 1,
    text: "That's a common point of confusion. Generally, completing the square is useful when you want to find the vertex of a parabola or rewrite the equation in a specific form. The quadratic formula is more general and works for any quadratic equation.",
    time: 'Yesterday, 4:15 PM',
    isUser: false,
  },
  {
    id: 4,
    sender: 'user',
    text: 'That makes sense! So for question 5 on the homework, which method would be better?',
    time: 'Yesterday, 4:18 PM',
    isUser: true,
  },
  {
    id: 5,
    sender: 1,
    text: "For question 5, since you need to find the solutions and the equation doesn't easily factor, the quadratic formula would be more efficient. Let me know if you want to go through it step by step.",
    time: 'Yesterday, 4:25 PM',
    isUser: false,
  },
  {
    id: 6,
    sender: 'user',
    text: 'Yes, please! That would be very helpful.',
    time: 'Yesterday, 4:30 PM',
    isUser: true,
  },
  {
    id: 7,
    sender: 1,
    text: "Let's take the equation 2x² + 5x - 3 = 0. Using the quadratic formula, x = [-b ± √(b² - 4ac)]/2a where a=2, b=5, and c=-3. Can you try substituting these values?",
    time: 'Yesterday, 4:45 PM',
    isUser: false,
  },
  {
    id: 8,
    sender: 'user',
    text: 'So I get x = [-5 ± √(25 - 4(2)(-3))]/2(2) which simplifies to x = [-5 ± √(25 + 24)]/4',
    time: 'Yesterday, 4:50 PM',
    isUser: true,
  },
  {
    id: 9,
    sender: 'user',
    text: 'That gives me x = [-5 ± √49]/4 = [-5 ± 7]/4',
    time: 'Yesterday, 4:51 PM',
    isUser: true,
  },
  {
    id: 10,
    sender: 1,
    text: "That's correct! So our solutions are x = (-5 + 7)/4 = 2/4 = 0.5 and x = (-5 - 7)/4 = -12/4 = -3. Well done!",
    time: 'Yesterday, 4:55 PM',
    isUser: false,
  },
  {
    id: 11,
    sender: 'user',
    text: 'Thank you for explaining! I think I understand it better now.',
    time: 'Yesterday, 5:00 PM',
    isUser: true,
  },
  {
    id: 12,
    sender: 1,
    text: "You're welcome. I've reviewed your latest assignment and I'm pleased with your progress. Keep up the good work, and don't hesitate to ask if you need further clarification on any topic.",
    time: '10:25 AM',
    isUser: false,
  },
];

export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>

      <div className="flex flex-1 overflow-hidden rounded-lg border border-gray-200">
        {/* Users sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {users.map(user => (
              <div
                key={user.id}
                className={`p-4 border-b border-gray-100 cursor-pointer flex items-center hover:bg-gray-50 ${
                  selectedUser.id === user.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                  {user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                    <p className="text-xs text-gray-500">{user.lastMessageTime}</p>
                  </div>
                  <p className="text-xs text-gray-500">{user.role}</p>
                  <p className="text-sm text-gray-600 truncate w-48">{user.lastMessage}</p>
                </div>
                {user.unread > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                    {user.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="w-2/3 flex flex-col bg-gray-50">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 bg-white flex items-center">
            <div className="relative">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full"
              />
              {selectedUser.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">{selectedUser.name}</h3>
              <p className="text-xs text-gray-500">
                {selectedUser.online ? 'Online' : 'Offline'}
                {selectedUser.role && ` • ${selectedUser.role}`}
              </p>
            </div>
            <div className="ml-auto flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockConversation.map(msg => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.isUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-xs block mt-1 ${msg.isUser ? 'text-blue-200' : 'text-gray-500'}`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  />
                  <path d="M14 7a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-gray-100 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mx-2"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className={`p-2 rounded-full ${
                  message.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
