from fastapi import HTTPException, status

class BaseAppException(HTTPException):
    def __init__(self, status_code: int, detail: str, headers: dict | None = None):
        super().__init__(status_code=status_code, detail=detail, headers=headers)

class AuthenticationFailedError(BaseAppException):
    def __init__(self, detail: str = "Credenciais inválidas ou token expirado"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, headers={"WWW-Authenticate": "Bearer"})

class PermissionDeniedError(BaseAppException):
    def __init__(self, detail: str = "Permissão negada. Você não tem acesso a este recurso."):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class ResourceNotFoundError(BaseAppException):
    def __init__(self, detail: str = "Recurso não encontrado."):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class ValidationError(BaseAppException):
    def __init__(self, detail: str = "Dados de entrada inválidos."):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

class DatabaseOperationError(BaseAppException):
    def __init__(self, detail: str = "Ocorreu um erro ao processar os dados na base."):
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)

class QuotaExceededError(BaseAppException):
    def __init__(self, detail: str = "Cota de uso excedida. Aguarde antes de enviar novamente."):
        super().__init__(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=detail)

class UploadRejectedError(BaseAppException):
    def __init__(self, detail: str = "Arquivo rejeitado. Verifique o tipo e tamanho máximo permitido."):
        super().__init__(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail=detail)

