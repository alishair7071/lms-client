"use client";
import Loader from "../../components/Loader/Loader";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import CourseContent from "../../components/Courses/CourseContent";
import Footer from "../../components/Footer";

const Page = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});
  useEffect(() => {
    if (data) {
      const isPurchased =
        data &&
        data.user.courses.find((item: any) => {
          const courseId = item?.courseId ?? item?._id ?? item;
          return courseId?.toString?.() === id?.toString?.();
        });
      if (!isPurchased) {
        router.replace("/");
      }
    }
    if (error) {
      router.replace("/");
    }
  }, [data, error, id, isLoading, router]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseContent id={id} user={data?.user} />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Page;