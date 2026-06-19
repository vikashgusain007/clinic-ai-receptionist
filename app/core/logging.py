import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def info_logger(message: str):
    logger.info(message)

def error_logger(message: str):
    logger.error(message)
