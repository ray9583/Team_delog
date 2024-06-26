/* 컴포넌트로 작업을 하는 이유는 Post를 가져오는 작업 및 어떤 포스트인지 구별하는 작업을 모두 이 페이지에서 해야 하기 때문이다. 

제목, 프로필, 상세 내용, 댓글, 카테고리가 있는 컴포넌트

*/
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseAPP";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostProps } from "./PostList";
import Loader from "./Loader";
import { toast } from "react-toastify";
import Comments from "./Comments";

export default function PostDetail() {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams(); // id 값을 추출해 내는 방법
  const navigate = useNavigate();

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");

    // 확인을 한 경우
    if (confirm && post && post.id) {
      await deleteDoc(doc(db, "posts", post.id));
      toast.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };

  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  return (
    <>
      <div className="post__detail">
        {post ? (
          <>
            <div className="post__box">
              <div className="post__title">{post?.title}</div>
              <div className="post__profile-box">
                {" "}
                {/* 게시글의 프로필 박스 */}
                <div className="post__profile" />{" "}
                {/* 게시글 등록자의 프로필 사진 공간 */}
                <div className="post__author-name">{post?.email}</div>{" "}
                {/* 등록자의 이름 */}
                <div className="post__date">{post?.createdAt}</div>{" "}
                {/* 등록한 날짜 */}
              </div>
              <div className="post__utils-box">
                {post?.category && ( // 카테고리가 존재하는 경우에만 출력
                  <div className="post__category">{post?.category}</div>
                )}
                {/* 게시글 수정/삭제 박스 */}
                <div
                  className="post__delete"
                  role="presentation"
                  onClick={handleDelete}
                >
                  삭제
                </div>{" "}
                {/* 게시글 삭제 */}
                <div className="post__edit">
                  <Link to={`/posts/edit/${post?.id}`}>수정</Link>
                </div>{" "}
                {/* 게시글 수정 */}
              </div>
              <div className="post__text post__text--pre-wrap">
                {post?.content} {/* 게시글의 내용 */}
              </div>
            </div>
            <Comments post={post} getPost={getPost} />
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
