import { Link, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import Img from "../media/default.png";
import GroupImg from "../media/group.png";
import Skeleton from "../Skeleton";
import { useLastMessage } from "../../hooks/useLastMessage";
import { useUsersInfo } from "../../hooks/useUsersInfo";

const SelectConversation = ({
  conversation,
  conversationId,
}) => {
  const { data: users, loading } = useUsersInfo(conversation.users);
  const currentUser = auth.currentUser.uid;
  
  const filtered = users?.filter((user) => user.id !== currentUser);

  const { convoId } = useParams();

  const {
    data: lastMessage,
    loading: lastMessageLoading,
  } = useLastMessage(conversationId);

  if (loading)
    return (
      <div className="loading_user">
        <Skeleton className="loading_user_photo"/>
        <div className="loading_user_detail">
          <Skeleton className="loading_user_name"/>
          <Skeleton className="loading_last_msg"/>
        </div>
      </div>
    );

if (conversation.users.length === 2) {
    return (
      <Link
        to={`/${conversationId}`}
        className={`user_info ${ conversationId === convoId && "selected_user"}`}
      >
        <div className="user_info">
          <img
            className="avatar"
            src={filtered?.[0]?.data()?.avatar || Img}
            alt=""
          />
          <div className="user_detail">
            <div className="user_detail_div">
              <p>
                {filtered?.[0].data()?.name}
              </p>
              {lastMessageLoading ? (
                <Skeleton className="loading_last_msg">Loading...</Skeleton>
              ) : (
                <p className="truncate">
                  {lastMessage?.message}
                </p>
              )}
            </div>
        </div>
        {!lastMessageLoading && (
          <>
            {lastMessage?.lastMessageId !== null &&
              lastMessage?.lastMessageId !==
                conversation.seen[currentUser?.uid] && (
                <div></div>
              )}
          </>
        )}
        </div>
      </Link>
    );
  }
  return (
    <Link
      to={`/${conversationId}`}
      className={`user_info ${ conversationId === convoId && "selected_user"}`}
    >
      {conversation?.group?.groupImage ? (
        <img
          className="avatar"
          src={conversation.group.groupImage}
          alt=""
        />
      ) : (
        <div className="user_info">
          <div className="group_avatar_div">
            <img
              className={`avatar ${ conversationId === convoId && "selected_user"}`}
              src={GroupImg}
              alt=""
            />
          </div>
          <div className="user_detail_div">
            <p className="user_detail">
              {conversation?.group?.groupName ||
                filtered
                ?.map((user) => user.data()?.name)
                .slice(0, 3)
                .join(", ")}
            </p>
            {lastMessageLoading ? (
              <Skeleton><p className="truncate">Loading ...</p></Skeleton>
            ) : (
              <p className="truncate">
                {lastMessage?.message}
              </p>
            )}
          </div>
        </div>
      )}
      {!lastMessageLoading && (
        <>
          {lastMessage?.lastMessageId !== null &&
            lastMessage?.lastMessageId !==
              conversation.seen[currentUser?.uid] && (
              <div></div>
            )}
        </>
      )}
    </Link>
  );
};

export default SelectConversation;