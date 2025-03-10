﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Pharoslab.Web.API.Managers;
using Pharoslab.Web.API.Models;

namespace Pharoslab.Web.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserManager _userManager;
        public UserController(IUserManager userManager)
        {
            _userManager = userManager;
        }
        [HttpGet]
        [Route("FetchUsersAsync")]
        public async Task<IActionResult> FetchUsersAsync()
        {
            try
            {
                var response = await _userManager.FetchUsersAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet]
        [Route("FetchUserByIdAsync/{userId}")]
        public async Task<IActionResult> FetchUserByIdAsync(Guid userId)
        {
            try
            {
                var response = await _userManager.FetchUserByIdAsync(userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet]
        [Route("FetchUserProfessionalsAsync/{userId}")]
        public async Task<IActionResult> FetchUserProfessionalsAsync(Guid userId)
        {
            try
            {
                var response = await _userManager.FetchUserProfessionalsAsync(userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet]
        [Route("FetchUserUserHobbiessAsync/{userId}")]
        public async Task<IActionResult> FetchUserUserHobbiessAsync(Guid userId)
        {
            try
            {
                var response = await _userManager.FetchUserProfessionalsAsync(userId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("InsertOrUpdateUserAsync")]
        public async Task<IActionResult> InsertOrUpdateUserAsync(UserRegistration userRegistration)
        {
            try
            {
                var response = await _userManager.InsertOrUpdateUserAsync(userRegistration);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpPost]
        [Route("InsertOrUpdateUserProfessionalAsync")]
        public async Task<IActionResult> InsertOrUpdateUserProfessionalAsync(UserProfessional userProfessional)
        {
            try
            {
                var response = await _userManager.InsertOrUpdateUserProfessionalAsync(userProfessional);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpPost]
        [Route("InsertOrUpdateUserHobbiesAsync")]
        public async Task<IActionResult> InsertOrUpdateUserHobbiesAsync(UserHobbies userHobbies)
        {
            try
            {
                var response = await _userManager.InsertOrUpdateUserHobbiesAsync(userHobbies);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
