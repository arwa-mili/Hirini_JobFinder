import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../utils/UserRequests";
import { getUser2 } from "../../utils/UserRequests";
import "./Conversation.css";
const Conversation = ({ data, currentUser, online }) =>
{

    const [userData, setUserData] = useState(null)
    const dispatch = useDispatch()

    useEffect(() =>
    {
        const userId = data.members.find((id) => id !== currentUser)
        const getUserData = async () =>
        {try{
                const { data } = await getUser(userId)
                setUserData(data)
                console.log("dataa", data)
                dispatch({ type: "SAVE_USER", data: data })}
            catch (error)
            {
                if (error.response && error.response.status === 404)
                {
                    try
                    {
                        const { data } = await getUser2(userId);
                        setUserData(data);
                        console.log("dataa", data)
                        dispatch({ type: "SAVE_USER", data: data })

                    } catch (secondApiError)
                    {
                        console.log(secondApiError);
                    }
                } else
                {
                    console.log(error);
                }
            }
        }
        getUserData();
    }, [data, currentUser, dispatch]
    );
    if (!userData)
    {
        return null;
    }
    else
    {
        console.log(userData)
    }
    return (
        <>
            <div className="follower conversation">
                <div>
                    {online && <div className="online-dot"></div>}
                    <img
                        src={userData?.user?.profileUrl ? userData.user.profileUrl : userData?.data?.profileUrl}
                        alt=""
                        className="followerImage"
                        style={{ width: "50px", height: "50px" }}
                    />
                    <div className="name" style={{ fontSize: '0.8rem' }}>
                        <span>{userData?.user?.firstName} {userData?.user?.lastName} {userData?.data?.name}</span>
                        <span style={{ color: online ? "#51e200" : "" }}>{online ? "Online" : "Offline"}</span>
                    </div>
                </div>
            </div>
            <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
        </>
    );
};

export default Conversation;