import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

export default function PostForm({ post }) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
    } = useForm({
        defaultValues: {
            title: post?.Title_01 || "",
            slug: post?.$id || "",
            content: post?.Content_02 || "",
            status: post?.Status_04 || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if (!userData) {
            alert("User not authenticated. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            let file;
            if (data.image?.[0]) {
                file = await appwriteService.uploadFile(data.image[0]);
                if (post?.FeaturedImage_03) {
                    await appwriteService.deleteFile(post.FeaturedImage_03);
                }
            }

            const payload = {
                Title_01: data.title,
                Content_02: data.content,
                FeaturedImage_03: file ? file.$id : post?.FeaturedImage_03 || "",
                Status_04: data.status,
                UserId_05: userData?.$id,
            };

            const dbPost = post
                ? await appwriteService.updatePost(post.$id, payload)
                : await appwriteService.createPost(payload);

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } catch (error) {
            console.error("Error submitting post:", error);
            alert("Something went wrong while submitting the post.");
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), {
                    shouldValidate: true,
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) =>
                        setValue("slug", slugTransform(e.currentTarget.value), {
                            shouldValidate: true,
                        })
                    }
                />
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Content :
                    </label>
                    <Editor
                        apiKey="o7f4ha8a4zaggnrzvct0vhjjhvv9qfpq3kxrw1nlmfw4bmw0"
                        initialValue={getValues("content")}
                        onEditorChange={(content) =>
                            setValue("content", content)
                        }
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                "advlist autolink lists link image charmap print preview anchor",
                                "searchreplace visualblocks code fullscreen",
                                "insertdatetime media table paste code help wordcount",
                            ],
                            toolbar:
                                "undo redo | styleselect | bold italic backcolor | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | link image | " +
                                "print preview media fullpage | forecolor backcolor emoticons | help",
                        }}
                    />
                </div>
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post?.FeaturedImage_03 && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.FeaturedImage_03)}
                            alt={post.Title_01}
                            className="rounded-lg"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                            }}
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}



