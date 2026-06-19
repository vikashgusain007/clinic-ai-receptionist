from typing import Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from core.security import get_password_hash
from db.models.user import User
from repositories.user import user_repository
from schemas.user import UserCreate, UserUpdate


class UserService:
    """
    Service layer containing business logic for users.
    """

    async def get_by_id(self, db: AsyncSession, user_id: Any) -> Optional[User]:
        return await user_repository.get(db, user_id)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        return await user_repository.get_by_email(db, email)

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        """
        Create a new user, automatically hashing the password.
        """
        hashed_password = get_password_hash(obj_in.password)
        # Create user model
        db_obj = User(
            email=obj_in.email,
            hashed_password=hashed_password,
            role=obj_in.role,
            is_active=obj_in.is_active,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self, db: AsyncSession, *, db_obj: User, obj_in: UserUpdate
    ) -> User:
        """
        Update user fields, automatically hashing the password if updated.
        """
        update_data = obj_in.model_dump(exclude_unset=True)
        if "password" in update_data and update_data["password"]:
            update_data["hashed_password"] = get_password_hash(
                update_data["password"]
            )
            del update_data["password"]
        return await user_repository.update(db, db_obj=db_obj, obj_in=update_data)

    # async def create_health_record(self, db: AsyncSession, *, obj_in: HealthRecordCreate) -> HealthRecord:
    #     """
    #     Create a new health record.
    #     """
    #     db_obj = HealthRecord(
    #         user_id=obj_in.user_id,
    #         type=obj_in.type,
    #         title=obj_in.title,
    #         description=obj_in.description,
    #     )
    #     db.add(db_obj)
    #     await db.commit()
    #     await db.refresh(db_obj)

    #     text = f"""
    #     Health Record Type:
    #     {db_obj.type}

    #     Title:
    #     {db_obj.title}

    #     Description:
    #     {db_obj.description}
    #     """


    #     vector = generate_embedding(text)
    #     print("embedding generated")
    #     print(vector)
    #     print("storing health memory")
    #     await store_health_memory(
    #         record_id=db_obj.id,
    #         user_id=db_obj.user_id.hex,
    #         text=text,
    #         vector=vector
    #     )
    #     print("health memory stored")
    #     return db_obj


user_service = UserService()
