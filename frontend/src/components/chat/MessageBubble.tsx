import React from 'react';
import { ChatMessage } from '../../types';
import { Avatar } from '../common/Avatar';
import { clsx } from 'clsx';

interface MessageBubbleProps {
  message: ChatMessage;
  isSelf: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSelf }) => {
  const timeStr = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={clsx('flex items-end gap-2.5 my-3', isSelf ? 'flex-row-reverse' : 'flex-row')}>
      {!isSelf && <Avatar name={message.userName} src={message.userAvatar} size="sm" />}
      <div
        className={clsx(
          'max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-md transition-all',
          isSelf
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none'
        )}
      >
        {!isSelf && (
          <p className="text-[10px] font-bold text-indigo-400 mb-0.5">{message.userName}</p>
        )}
        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p
          className={clsx(
            'text-[9px] mt-1 text-right font-medium',
            isSelf ? 'text-indigo-200' : 'text-slate-400'
          )}
        >
          {timeStr}
        </p>
      </div>
    </div>
  );
};
