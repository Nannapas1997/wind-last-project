"use client";
import * as React from "react";

export default function Test1UI(props) {
  return (
    <div className="items-start bg-white flex flex-col px-5">
      <div className="items-center self-stretch flex flex-col my-5 max-md:max-w-full">
        <div className="items-center bg-sky-700 self-stretch flex flex-col pt-2.5 px-5 rounded-lg max-md:max-w-full">
          <div className="text-white text-center text-xl self-center max-w-[426px] pb-2">
            ข้อมูลแปลงที่ดิน : พื้นที่ใต้รัศมีใบพัด / WTG 1
          </div>
        </div>
        <div className="items-start self-stretch flex flex-col mt-2.5 pr-5 max-md:max-w-full mx-11">
          <div className="flex w-[330px] max-w-full items-start gap-2.5 max-md:justify-center">
            <div className="items-end self-stretch flex flex-col">
              <div className="text-stone-800 text-right text-xl items-start bg-white w-[64px] max-w-full px-2 py-2.5 ">
                เลขที่
              </div>
              <div className="text-stone-800 text-xl items-start bg-white w-[161px] max-w-full mt-2.5 px-2 py-2.5 pe-3">
                เจ้าของกรรมสิทธิ์
              </div>
              <div className="text-stone-800 text-right text-xl items-start bg-white w-[64px] max-w-full mt-2.5 px-2 py-2.5 pe-3">
                เนื้อที่
              </div>
              <div className="text-stone-800 text-xl items-start bg-white w-32 max-w-full grow mt-2.5 px-2 py-2.5 pe-3">
                ค่าพิกัดแปลง
              </div>
            </div>
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/e5886f63-a94a-4f50-81c1-3448ab2d9e31?apiKey=4be4ad853f33420597c893f6653352e5&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/e5886f63-a94a-4f50-81c1-3448ab2d9e31?apiKey=4be4ad853f33420597c893f6653352e5&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e5886f63-a94a-4f50-81c1-3448ab2d9e31?apiKey=4be4ad853f33420597c893f6653352e5&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/e5886f63-a94a-4f50-81c1-3448ab2d9e31?apiKey=4be4ad853f33420597c893f6653352e5&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/e5886f63-a94a-4f50-81c1-3448ab2d9e31?apiKey=4be4ad853f33420597c893f6653352e5&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/e5886f63-a94a-4f50-81c1-3448ab2d9e31?apiKey=4be4ad853f33420597c893f6653352e5&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/e5886f63-a94a-4f50-81c1-3448ab2d9e31?apiKey=4be4ad853f33420597c893f6653352e5&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/e5886f63-a94a-4f50-81c1-3448ab2d9e31?apiKey=4be4ad853f33420597c893f6653352e5&"
              className="aspect-[0.02] object-cover object-center w-[5px] self-stretch overflow-hidden max-w-full"
            />
            <div className="items-start self-stretch flex flex-col">
              <div className="text-stone-800 text-right text-xl items-start bg-white w-[106px] max-w-full px-2 py-2.5 pe-9">
                โฉนดที่
              </div>
              <div className="text-stone-800 text-xl items-start bg-white w-[50px] max-w-full mt-2.5 px-2 py-2.5">
                นาย
              </div>
              <div className="text-stone-800 text-right text-xl items-start bg-white w-[98px] max-w-full mt-2.5 px-2 py-2.5">
                99-9-9ไร่
              </div>
              <div className="text-stone-800 text-xl items-start bg-white w-[105px] max-w-full grow mt-2.5 px-2 py-2.5">
                15.167xxx
              </div>
            </div>
          </div>
        </div>
        <div className="items-center bg-sky-700 self-stretch flex flex-col mt-2.5 pt-2.5 px-5 rounded-lg max-md:max-w-full">
          <div className="text-white text-center text-xl self-center max-w-[426px] pb-2">
            หมายเหตุ : อยู่ระหว่าง WTG 1 และ WTG 2
          </div>
        </div>
        <div className="text-white text-center text-xl self-center max-w-full items-center bg-red-700 w-[443px] grow mt-2.5 pt-2.5 px-5 rounded-2xl max-md:pl-1 max-md:pr-1 pb-2">
          รายละเอียดพื้นที่เช่า
        </div>
      </div>
    </div>
  );
}


