import { Link, useParams } from "react-router-dom";
import { auth } from "../../firebase";
import Img from "../../image1.jpg";
import Skeleton from "../Skeleton";
import { useLastMessage } from "../../hooks/useLastMessage";
import { useUsersInfo } from "../../hooks/useUsersInfo";

const SelectConversation = ({
  conversation,
  conversationId,
}) => {
  const { data: users, loading } = useUsersInfo(conversation.users);
  const currentUser = auth.currentUser.uid;
  
  const filtered = users?.filter((user) => user.id !== currentUser?.uid);

  const { id } = useParams();

  const {
    data: lastMessage,
    loading: lastMessageLoading,
    error: lastMessageError,
  } = useLastMessage(conversationId);

  if (loading)
    return (
      <div>
        <Skeleton />
        <div>
          <Skeleton />
          <Skeleton />
        </div>
      </div>
    );

if (conversation.users.length === 2) {

    return (
      <Link
        to={`/${conversationId}`}
        className={`user_wrapper ${ conversationId === id ? "selected_user" : "" }`}
      >
        <div className="user_info">
          <img
            className="avatar"
            src={filtered?.[0]?.data()?.avatar || Img}
            alt=""
          />
          <div classname="user_detail">
            <div className="user_detail_div">
              <p>
                {filtered?.[0].data()?.name}
              </p>
              {lastMessageLoading ? (
                <Skeleton />
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
      className={`user_wrapper ${ conversationId === id ? "selected_user" : "" }`}
    >
      {conversation?.group?.groupImage ? (
        <img
          className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
          src={conversation.group.groupImage}
          alt=""
        />
      ) : (
        <div className="user_info">
          <img
            className="avatar"
            src={Img}
            alt=""
          />
          <img
            className={`user_wrapper ${ conversationId === id ? "selected_user" : "" }`}
            src={Img}
            alt=""
          />
        </div>
      )}
      <div className="flex flex-grow flex-col items-start gap-1 py-1">
        <p className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">
          {conversation?.group?.groupName ||
            filtered
              ?.map((user) => user.data()?.displayName)
              .slice(0, 3)
              .join(", ")}
        </p>
        {lastMessageLoading ? (
          <Skeleton className="w-2/3 flex-grow" />
        ) : (
          <p className="max-w-[240px] flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-400">
            {lastMessage?.message}
          </p>
        )}
      </div>
      {!lastMessageLoading && (
        <>
          {lastMessage?.lastMessageId !== null &&
            lastMessage?.lastMessageId !==
              conversation.seen[currentUser?.uid] && (
              <div className="bg-primary absolute top-1/2 right-4 h-[10px] w-[10px] -translate-y-1/2 rounded-full"></div>
            )}
        </>
      )}
    </Link>
  );
};

export default SelectConversation;