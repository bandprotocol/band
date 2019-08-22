git diff --name-only $(git merge-base --fork-point master) | cut -d/ -f1 | sort -u

CIRCLE_BRANCH=master
build=1
if [[ ${CIRCLE_BRANCH} == "master" ]]; then
    build="0"
  fi
echo "${build}"

if [[ ${build} == "0" ]]; then
  echo "MASTER NOT BUILD"
  exit 0
fi