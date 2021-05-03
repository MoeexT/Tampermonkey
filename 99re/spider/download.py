#! py -3

import os
import re
import requests
import pyperclip
import cv2.cv2 as cv

EMBED_URL = "https://www.99a46.com/embed/"


def get_video_url(id):
    response = requests.get(EMBED_URL + id)
    try:
        url = re.search('http.*?mp4', response.text).group()
        pyperclip.copy(url)
        print("已将\"" + url + "\"放至剪切板。")
    except ArithmeticError as e:
        url = ""
        print(e)
    return url


def download_video(id, url):
    path = "D:\\Users\\Administrator\\Downloads\\og\\" + id + ".mp4"
    req = requests.get(url)
    with open(path, "wb") as video:
        video.write(req.content)
    print("下载" + id + ".mp4成功:", str(os.path.getsize(path) >> 20) + "MB")
    return path


def play_video(video):
    pass


if __name__ == "__main__":
    while True:
        code = input("video id:")
        if code == "0":
            break
        elif code != "":
            vodeo_url = get_video_url(code)
            if vodeo_url == "":
                continue
            file = download_video(code, vodeo_url)
            os.system("start " + file)
            if input("是否删除视频？") == ".":
                os.remove(file)
            else:
                csv = open("D:\\Users\\Administrator\\Downloads\\og\\info.csv", 'a')
                csv.write(code + ", " + EMBED_URL + code + ", " + vodeo_url + "\n")
                csv.close()
        else:
            continue
