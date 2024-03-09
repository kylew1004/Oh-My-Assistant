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
