from fastapi import APIRouter, Depends
from fastapi import Query, status
from schemas.response import APIResponse
from schemas.user import UserResponse
from services.user import user_service
from schemas.user import UserCreate
from sqlalchemy.ext.asyncio import AsyncSession
from core.dependencies import get_db
from services.vector_memory import search_memory


router = APIRouter()


@router.post("/create-user", response_model=APIResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate, db: AsyncSession = Depends(get_db)
) -> APIResponse[UserResponse]:
    """
    Create a new user.
    """
    print("Creating user...")
    print(user_in)
    user = await user_service.create(db, obj_in=user_in)
    return APIResponse(
        success=True,
        message="User successfully created",
        data=None,
    )

# @router.post("/create-health-record", response_model=APIResponse[HealthRecordResponse], status_code=status.HTTP_201_CREATED)
# async def create_health_record(
#     health_record_in: HealthRecordCreate, db: AsyncSession = Depends(get_db)
# ) -> APIResponse[HealthRecordResponse]:
#     """
#     Create a new health record.
#     """
#     print("Creating health record...")
#     print(health_record_in)
#     health_record = await user_service.create_health_record(db, obj_in=health_record_in)
#     return APIResponse(
#         success=True,
#         message="Health record successfully created",
#         data=HealthRecordResponse.from_orm(health_record),
#     )


# # router = APIRouter()


# @router.get(
#     "/search",
#     response_model=APIResponse,
#     status_code=status.HTTP_200_OK
# )
# async def search_health_memory(
#     user_id: str,
#     query: str = Query(..., min_length=3)
# ):

#     results = await search_memory(
#         user_id=user_id,
#         query=query
#     )

#     return APIResponse(
#         success=True,
#         message="Memory search completed",
#         data=results
#     )
