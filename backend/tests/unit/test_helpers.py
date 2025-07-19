from unittest.mock import Mock, patch

import pytest
from helpers import add_and_commit, get_db
from sqlalchemy.exc import SQLAlchemyError


class TestHelpers:
    """Test cases for helper functions."""
    
    @pytest.mark.unit
    def test_add_and_commit_success(self):
        """Test successful add and commit operation."""
        # Arrange
        mock_db = Mock()
        mock_item = Mock()
        
        # Act
        result = add_and_commit(mock_db, mock_item)
        
        # Assert
        assert result is True
        mock_db.add.assert_called_once_with(mock_item)
        mock_db.commit.assert_called_once()
        mock_db.refresh.assert_called_once_with(mock_item)
        mock_db.rollback.assert_not_called()
    
    @pytest.mark.unit
    def test_add_and_commit_failure(self):
        """Test add and commit operation failure."""
        # Arrange
        mock_db = Mock()
        mock_item = Mock()
        mock_db.commit.side_effect = SQLAlchemyError("Database error")
        
        # Act
        result = add_and_commit(mock_db, mock_item)
        
        # Assert
        assert result is False
        mock_db.add.assert_called_once_with(mock_item)
        mock_db.commit.assert_called_once()
        mock_db.rollback.assert_called_once()
        mock_db.refresh.assert_not_called()
    
    @pytest.mark.unit
    def test_add_and_commit_no_db_session(self):
        """Test add and commit with None database session."""
        # Arrange
        mock_item = Mock()
        
        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            add_and_commit(None, mock_item)
        
        assert "Database session is not available" in str(exc_info.value)
    
    @pytest.mark.unit
    @patch('helpers.mysql_db')
    def test_get_db_dependency(self, mock_mysql_db):
        """Test get_db dependency function."""
        # Arrange
        mock_session = Mock()
        mock_mysql_db.get_session.return_value = mock_session
        
        # Act
        db_generator = get_db()
        db_session = next(db_generator)
        
        # Assert
        assert db_session == mock_session
        mock_mysql_db.get_session.assert_called_once()
        
        # Test cleanup
        try:
            next(db_generator)
        except StopIteration:
            pass  # Expected behavior
        
        mock_session.close.assert_called_once()
    
    @pytest.mark.unit
    @patch('helpers.mysql_db')
    def test_get_db_dependency_with_exception(self, mock_mysql_db):
        """Test get_db dependency function when exception occurs."""
        # Arrange
        mock_session = Mock()
        mock_mysql_db.get_session.return_value = mock_session
        
        # Act
        db_generator = get_db()
        db_session = next(db_generator)
        
        assert db_session == mock_session
        
        # Simulate exception and cleanup
        try:
            db_generator.throw(Exception("Test exception"))
        except Exception:
            pass
        
        # Assert cleanup was called
        mock_session.close.assert_called_once()
