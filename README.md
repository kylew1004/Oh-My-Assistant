
# 웹툰 작가들을 위한 그림 생성 서비스 'Oh My Assistant'

<p align='center'>
    <img src="https://github.com/kylew1004/doraemon_web/assets/20416616/adb0d0a7-3c1d-4edb-9f1e-bebb0deed825" width=500>
</p>

> Oh My Assistant는 웹툰 및 일러스트 작가들을 돕기 위한 생성형 AI 서비스로, 작가 개개인의 그림체를 학습해 실사 이미지를 해당 그림체로 변환하고 웹툰 내 캐릭터의 포즈를 변경해주는 서비스를 제공하고 있습니다. 

<div align=center>
    <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=PyTorch&logoColor=white">
    <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=Python&logoColor=white">
    <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white">
    <img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=FastAPI&logoColor=white">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white">
</div>


## Table of content
- [Live Demo](#Demo)
- [Member](#Member)
- [Timeline](#Timeline)
- [Project Background](#Background)
- [Service Architecture](#Service)
- [Modelling-Background](#ModelBackground)
- [Modeling-Pose](#ModelPose)
- [Project Roadmap](#Roadmap)


## Live Demo <a id = 'Demo'></a>
- 다음 [링크](http://www.gangyub.site)에서 직접 실행해보실 수 있습니다.

### Background Image Generator
https://github.com/kylew1004/doraemon_web/assets/20416616/1b37ceaf-63a6-4d03-8aa5-eb76818fd304


### Pose Image Generator


https://github.com/kylew1004/doraemon_web/assets/20416616/59ba6d9f-e47d-4781-a622-0b9e073ec84e



## Member <a id = 'Member'></a>

|김찬우|남현우|류경엽|이규섭|이현지|한주희|
|:--:|:--:|:--:|:--:|:--:|:--:|
|<a href='https://github.com/uowol'><img src='https://avatars.githubusercontent.com/u/20416616?v=4' width='100px'/></a>|<a href='https://github.com/nhw2417'><img src='https://avatars.githubusercontent.com/u/103584775?s=88&v=4' width='100px'/></a>|<a href='https://github.com/kylew1004'><img src='https://avatars.githubusercontent.com/u/5775698?s=88&v=4' width='100px'/></a>|<a href='https://github.com/9sub'><img src='https://avatars.githubusercontent.com/u/113101019?s=88&v=4' width='100px'/></a>|<a href='https://github.com/solee328'><img src='https://avatars.githubusercontent.com/u/22787039?s=88&v=4' width='100px'/></a>|<a href='https://github.com/jh7316'><img src='https://avatars.githubusercontent.com/u/95545960?s=88&v=4' width='100px'/></a>|
|Modeling|Modeling|Backend|Backend|Modeling|Frontend|
|Background<br>Image<br>Generate|Background<br>Image<br>Generate|PL<br>Infra<br>Serving|Implement BE|Pose<br>Image<br>Generate|UI/UX Design<br>Implement FE |  

## Project Timeline <a id = 'Timeline'></a>

<p align='center'>
    <img src="https://github.com/kylew1004/doraemon_web/assets/113101019/a816240d-cf43-4f0e-ac58-86fc580faeb3" width="80%">
</p>

## Project Background <a id = 'Background'></a>

### 기획 의도 및 기대효과

<p align='center'>
    <img src="https://github.com/kylew1004/doraemon_web/assets/113101019/b682f8ef-197c-4840-932d-6d3f4ed890ca" width="80%">
</p>

- 배경: 국내 웹툰작가들의 열악한 작업 환경은 웹툰 업계에서 고질적인 문제로 이어져 왔습니다. 할당된 작업량에 비해 촉박한 작업 기간, 그리고 컷 수 조정이나 휴재권 보장이 제대로 이루어지지 않는 환경때문에 많은 작가들이 정신적, 신체적 건강 악화로 피해를 받고 있습니다. 
- 목적: 반복적이지만 시간을 많이 소요하는 배경 생성, 캐릭터 포즈 변경 등의 작업들을 생성형 AI를 통해 해결합니다. 특히 배경 생성의 경우, 작가 개개인의 그림체를 학습하여 작가 맞춤형 AI 모델을 사용해 보다 더 자연스러운 이미지를 생성합니다. 해당 서비스를 통해 결과물의 퀄리티는 더 높이면서 작업시간을 단축시켜줍니다.  


---


## Service Architecture <a id = 'Service'></a>

<p align='center'>
    <img src="https://github.com/kylew1004/doraemon_web/assets/5775698/254a54c9-9f83-4f00-a26d-e73a57ac4bb5" width="80%>
</p>

- 서비스 간의 상호 의존도를 낮추기 위해 웹 서버와 모델 서버를분리하였습니다. 
- 웹 서빙을 담당하는 웹 프론트엔드 서버, 백엔드 서버 및 db 서버는 전부 aws ec2 서버에서 호스팅되고, 모델 서버는 NCP v100서버에서 호스팅되어 있습니다. 
- 백엔드 서버는 프론트에서 받은 인풋 이미지나 프롬프트를 모델 서버로 보내게 되고, 모델 서버는 이에 대한 응답으로 해당 인풋에 대한 inference 결과를 전송합니다. 
- 백엔드 서버에서 해당 결과를 다시 프론트로 보내서 유저에게 보여주고, 최종적으로 유저가 해당 결과를 저장하고 싶으면 프론트에서 관련 요청을 백엔드 서버로 보내 aws s3저장소에 관련 사진들을 저장합니다. 



## Modeling - Background <a id = 'ModelBackground'></a>

### Inference
<p align='center'>
    <img src="https://github.com/kylew1004/doraemon_web/assets/20416616/360b9289-0469-4a5e-8e01-fc3e5e87ada9" width="80%">
</p>

배경 생성 서비스는 원본 이미지가 주어지는지 여부에 따라서 Stable Diffusion의 Img2Img 모델과 Txt2Img 모델 중 하나를 선택하고, 다음의 과정을 거쳐 웹툰 스타일의 이미지를 생성합니다.
1. Noise Initialization
    - 원본 이미지가 주어진 경우 원본 이미지에 노이즈를 단계적으로 추가하는 방법으로 노이즈를 생성합니다. 이때 Strength 파라미터의 값에 따라 추가되는 노이즈의 양이 결정됩니다. 0으로 설정할 경우 노이즈가 추가되지 않으며, 1일 경우 노이즈가 최대치로 추가되어 변형된 이미지가 완전 랜덤한 텐서(random tensor)가 됩니다. 일반적으로 0에 가까울수록 원본 이미지를 유지하며 1에 가까울수록 제약에서 벗어나 자유롭게 이미지를 생성합니다.
    - 원본 이미지가 주어지지 않은 경우 완전 랜덤한 텐서로 노이즈를 생성합니다.
2. Inject Condition
    - 이미지나 텍스트 등 다양한 피쳐를 노이즈를 제거하는 과정에 활용하여 사용자가 요구하는 이미지를 생성할 수 있습니다. 우리의 모델은 프롬프트를 입력으로 받아 CLIP 모델의 텍스트 인코더를 활용하여 임베딩 벡터를 추출합니다. 이 때 트리거 단어라는, 일반적인 단어가 아닌 학습에 활용한 데이터의 특징을 자율적으로 학습할 수 있는 단어를 활용하여(Text Inversion) 더 자세하고 높은 품질의 특징을 활용할 수 있습니다.
3. Denoising Process
    - 앞에서 생성한 노이즈를 입력으로 받아 단계별로 노이즈를 제거해 나가며 고 해상도의 이미지를 생성합니다. 크로스 어텐션 메커니즘을 활용하여 조건으로 주어지는 피쳐가 노이즈 제거 과정을 유도합니다. 유도하는 정도를 guidance_score 파라미터로 조절할 수 있으며 일반적으로 7.5를 사용합니다. 파라미터 값을 키울수록 노이즈를 제거하는 과정에서 조건으로 주어지는 피쳐를 더 크게 반영합니다. 

정리하면, 웹툰 스타일을 학습한 모델에 원본 이미지나 프롬프트를 입력하면 이를 바탕으로 노이즈를 생성하고 제거하는 과정을 유도함으로써 작가가 요구하는 배경 이미지를 생성할 수 있게 합니다.

### Train
<p align='center'>
    <img src="https://github.com/kylew1004/doraemon_web/assets/20416616/fc8898c2-74f2-4df5-9a9c-8539b3c8837f" width="80%">
</p>

보다 완성도 높은 이미지를 생성하기 위해 배경 생성 모델을 파인튜닝하는 과정을 추가하였습니다. 최대 학습 시간 20분, 생성 시간은 1분 내로 진행되는 동시에 웹툰의 스타일을 잘 살리는 모델을 리서치하여 다음의 두 모델을 선정하였습니다.
- LoRA
    - 한 장 이상의 이미지로 학습하여 처음 보는 이미지에 대해서도 잘 생성하며 원본 이미지를 잘 유지합니다. 또한, 반복적으로 실험했을 때 안정적인 성능을 보입니다.
    - 전체를 파인튜닝하는 것에 비해 수백분의 일 계산 비용으로 비슷한 성능을 낼 수 있습니다. 
    - 학습된 결과가 10MB 정도로 가볍고 간단하게 기존 모델에 더해서 사용할 수 있기 때문에 여러 파인 튜닝된 모델을 결합하여 사용하는 것도 쉽게 구현할 수 있습니다.  
- DreamStyler
    - 한 장의 학습 사진만 사용하기 때문에 성능의 안정성이 조금 떨어지지만 LoRA 모델보다 프롬프트를 잘 반영하고 웹툰의 스타일을 잘 살리는 성능을 보입니다.
- 두 개의 학습한 모델은 서로 다른 강점을 가지기 때문에 inference 단계에서 사용자가 원하는 모델을 선택하여 배경 이미지를 생성할 수 있게 하였습니다. 

### Result
![image](https://github.com/boostcampaitech6/level2-cv-datacentric-cv-02/assets/20416616/5c77ea70-74aa-45bc-8efc-57b0c7f6a3b7)
![image](https://github.com/boostcampaitech6/level2-cv-datacentric-cv-02/assets/20416616/b4b98d35-2718-483c-a20f-86599dfd2b61)


## Modeling - Pose <a id = 'ModelPose'></a>
캐릭터 포즈 변경은 크게 Pose Estimation, Pose Transfer 두 단계로 진행됩니다.

### Pose Estimation
<p align='center'>
    <img src="https://github.com/kylew1004/doraemon_web/assets/22787039/2a586197-552f-44d6-a441-1b7410aabbbf" width="60%">
</p>

Pose Estimation 모델은 <a href="https://github.com/IDEA-Research/DWPose/tree/onnx" target="_blank">DWPose</a>를 사용합니다. DWPose는 입력 이미지에서 신처를 찾는 Detector와 신체 keypoint를 분류하는 Classifier를 거쳐 얼굴, 손, 팔, 다리에 대해 전체 133개의 keypoint(COCO Whole Body)를 예측합니다.


### Pose Transfer
<p align='center'>
    <img src="https://github.com/kylew1004/doraemon_web/assets/22787039/0690d10f-66db-4110-b7ae-f7744ab86aad" width="80%">
</p>

Pose Transfer는 Diffusion 모델을 기반으로 한 <a href="https://github.com/MooreThreads/Moore-AnimateAnyone" target="_blank">AnimateAnyone</a> 을 사용합니다. 이전 Estimation에서 추출된 Target Pose 이미지와 사용자가 입력한 캐릭터 이미지가 입력되어 VAE, CLIP Encoder로 임베딩됩니다.
Noise로부터 포즈가 변경된 캐릭터 이미지가 생성되도록 Denoising UNet과 ReferenceNet을 사용하며 VAE Decoder로 이미지를 디코딩해 결과 이미지로 출력합니다.


## Project Roadmap <a id = 'Roadmap'></a>
- [ ]  학습 이미지의 수에 따라 스타일 강도 조절하기
- [x]  한글 프롬프트 처리하기
- [ ]  배경이미지로 학습한 가중치를 활용해 인물 생성 제어하기
- [x]  다른 옵션의 모델 추가
- [ ]  경량화 된 모델 추가


## Directory
<!-- 합치면 -->

## Links
- [발표영상](https://youtu.be/huVYC4bZgOg)
- [Wrapup Reports](https://pebble-ziconium-f61.notion.site/Wrap-up-Reports-42bf8884d38244afbb5ef24a6f06ed3e?pvs=4)



