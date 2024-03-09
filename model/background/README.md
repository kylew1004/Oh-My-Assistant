# FastAPI 개발
- 전체 구조를 생각하기 => 파일, 폴더 구조를 어떻게 할까?
    - predict.py, api.py, config.py
    - Presentation(API) <-> Application(Service) <-> Database
- API : 외부와 통신, 건물의 문처럼 외부 경로, 클라이언트에서 API 호출, 학습 결과 return
    - schema: FastAPI에서 사요되는 개념
        - 자바의 DTO(Data Transfer Object)와 비슷한 개념, 네트워크를 통해 데이터를 주고 받을 때 어떤 형태로 주고 받을 지 정의
        - 예측(Request, Response)
        - Pydantic의 Basemodel을 사용해서 정의, Request, Response에 맞게 정의, Payload
- Application: 실제 로직, 머신러닝 모델이 예측/추론
- Database: 데이터를 어딘가 저장하고 데이터를 가지고 오면서 활용
- Config: 프로젝트의 설정 파일을 저장
- 역순으로 개발

# 구현해야 하는 기능
## TODO Tree 설치
- TODO Tree 확장 프로그램 설치
- [ ]: 해야할 것
- [x]: 완료
- FIXME: FIXME

## 기능 구현
- [x]: FastAPI 서버 만들기
- [x]: FastAPI가 띄워질 때, 모델 불러오기 
- [x]: Config 설정

## 작업사항
- app/main.py - 서버를 실행합니다. index로 간단한 form 양식이 주어집니다.
- app/api.py - 모델의 학습에 관련한 API를 작성합니다.
- app/config.py - 이 부분만 수정하여 사용하는 모델과 모델의 학습 경로를 결정합니다.
- app/database.py - API 요청에 대한 결과로 주어지는 데이터의 형태를 결정합니다.
- app/model.py - 모델이 실제 동작하는 코드를 작성합니다.
- app/schemas.py - API 요청과 응답의 형태를 결정합니다.