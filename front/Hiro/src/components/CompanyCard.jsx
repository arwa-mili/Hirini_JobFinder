import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { createChat, findChat } from '../utils/chatRequests';

const CompanyCard = ({ cmp }) =>
{
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  console.log(user._id)
  console.log(cmp._id)
  const handleChatClick = async () =>
  {
    /* try
     {
 
 
       const existingChat = await findChat(cmp._id, user._id);
 
       if (!existingChat)
       {
         console.log("created")
         const newchat = await createChat({ companyId: cmp._id, userId: user._id });
         console.log
         navigate(`/chat`);
       }
       else
       {
         window.location.href = `/chat`;
       }
 
 
 
     } catch (error)
     {
       console.error('Error creating or finding chat:', error);
     }*/

    try
    {
      try
      {
        const response = await findChat(cmp._id, user._id);
        // Rest of the code remains the same
        // ...
      } catch (error)
      {
        if (error.response && error.response.status === 404)
        {
          // Handle 404 case, e.g., create a new chat
          console.log("Chat not found, creating a new chat...");
          const newChat = await createChat({ senderId: user._id, receiverId: cmp._id });
          console.log("New chat created", newChat);
          // Add 'await' here
        } else
        {
          console.error('Error creating or finding chat:', error);

        }
      }
    } catch (error)
    {
      console.error('Error in handleChatClick:', error);
    }

    navigate(`/chat`);




  }


  return (
    <div className='w-full h-16 flex gap-4 items-center justify-between bg-white shadow-md rounded'>
      <div className='w-3/4 md:w-2/4 flex gap-4 items-center'>
        <Link to={`/company-profile/${cmp?._id}`}>
          <img
            src={cmp?.profileUrl}
            alt={cmp?.name}
            className='w-8 md:w-12 h-8 md:h-12 rounded'
          />
        </Link>
        <div className='h-full flex flex-col'>
          <Link
            to={`/company-profile/${cmp?._id}`}
            className='text-base md:text-lg font-semibold text-gray-600 truncate'
          >
            {cmp?.name}
          </Link>
          <span className='text-sm text-blue-600'>{cmp?.email}</span>
        </div>
      </div>

      <div className='hidden w-1/4 h-full md:flex items-center'>
        <p className='text-base text-start'>{cmp?.location}</p>
      </div>

      <div className='w-1/4 h-full flex flex-col items-center'>
        <p className='text-blue-600 font-semibold'>{cmp?.jobPosts?.length}</p>
        <span className='text-xs md:base font-normal text-gray-600'>
          Jobs Posted
        </span>


        <button onClick={handleChatClick}> Start Chat</button>
      </div>
    </div>

  );
};

export default CompanyCard;
