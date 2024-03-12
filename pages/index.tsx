import { GetServerSideProps,NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl:string;
}

const IndexPage: NextPage<Props> = ({initialImageUrl}) => {
    const [imageUrl, setImageUrl] = useState(initialImageUrl); //　初期値を渡す
    const [loading, setLoading] = useState(false); // 初期状態falseで、非ローディング中
    // useEffect(() => {
    //     fetchImage().then((newImage) => {
    //         setImageUrl(newImage.url); //返り値のImage型のオブジェクトからurlプロパティの値を取得
    //         setLoading(false); // 非ローディング中はfalse
    //     })
    // }, []);
    const handleClick = async() => {
        setLoading(true);
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    };
    return (
        <div className={styles.page}>
            <button className={styles.button} onClick={handleClick}>他のにゃんこも見る</button>
            <div className={styles.frame}>
                { loading || <img src={imageUrl} className={styles.img} />}
            </div>
        </div>
    );
};

export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> =  async() => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

// Image型の定義
type Image ={
    height: number;
    url: string;
    width: number;
}

const fetchImage = async(): Promise<Image> => {
    // APIを叩き切るまで、待つ
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    // jsonに変換するまで待つ
    const images: unknown = await res.json();
    // 配列かチェック
    if (!Array.isArray(images)) {
        throw new Error("猫の画像を取得できませんでした");
    }
    const image = images[0];
    // Image型かチェック
    if (!isImage(image)) {
        throw new Error("猫の画像を取得できませんでした");
    }
    console.log(image);
    return image;
};


const isImage = (value: unknown): value is Image => {
    // 値がオブジェクトかどうか
    if (!value || typeof value !== "object" ) {
        return false;
    }
    // 値にurlプロパティが存在し、かつそれが文字列かどうか
    return "url" in value && typeof value.url === "string";
};
